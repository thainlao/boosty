import db from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

export const getMe = async (req, res) => {
    try {
        const userId = req.userId;
    
        // Выбираем данные пользователя из базы данных
        const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        // Проверяем, существует ли пользователь
        if (result.rows.length === 0) {
          return res.json({ message: 'Такого юзера не существует' });
        }
        const user = result.rows[0];
        // Создаем новый токен (если это необходимо)
        const token = jwt.sign({ id: user.id }, process.env.SECTREC_KEY, { expiresIn: '30d' });
    
        // Отправляем данные пользователя и, при необходимости, токен
        res.json({ user, token });
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Произошла ошибка' });
      }
}

export const registerUser = async (req ,res) => {
  try {
    const {email, password, username} = req.body;
    try {
        //существует ли такой юзер
        const emailExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailExists.rows.length > 0) {
            return res.json({ message: 'This Email is already used' });
        }

        const usernameExists = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (usernameExists.rows.length > 0) {
            return res.json({ message: 'This username is already used'})
        }

        const activationLink = uuidv4();
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: false,
          auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD
          }
      });
      console.log(process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER, process.env.SMTP_PASSWORD)
        const mailOptions = {
          from: process.env.SMTP_USER, // Отправитель
          to: email, // Получатель
          subject: 'Активация учетной записи',
          text: '',
          html: 
          `
          <div>
              <h1>Для активации перейдите по ссылке</h1>
              <a href=http://localhost:5173/activate/${activationLink}>http://localhost:5173/activate/${activationLink}</a>
          </div>
          `
      };
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error sending activation email' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const newUser = await db.query(
          'INSERT INTO users (username, email, hashed_password, ActivationLink, isActivated) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [username, email, hashedPassword, activationLink, false]
        );

        // Generate JWT token
        const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.SECTREC_KEY, { expiresIn: '30h' });

        res.json({ token, user: newUser.rows[0], message: 'Successful registration. Activation email sent.' });
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Something went wrong.' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUser = async (req, res) => {
  const {email, password} = req.body;
  try {
      const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (user.rows.length === 0) {
          return res.json({ message: 'Данный пользователь не найден' });
      }

      const passwordMatch = await bcrypt.compare(password, user.rows[0].hashed_password);
      if (!passwordMatch) {
          return res.json({ message: 'Не правильный пароль' });
      }
      
      const token = jwt.sign({ userId: user.rows[0].id }, process.env.SECTREC_KEY, { expiresIn: '30h' });
      res.json({ token, user: user.rows[0], message: 'Успешная авторизация' });
  } catch (e) {
    res.json({ message: 'Something went wrong.' });
  }
}

export const uploadAvatar = async (req, res) => {
  const userId = req.userId;
  try {
    if (req.files) {
      let fileName = Date.now().toString() + req.files.image.name
      const __dirname = dirname(fileURLToPath(import.meta.url))
      req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))

      const updateQuery = 'UPDATE users SET avatar = $1 WHERE id = $2 RETURNING *';
      const updatedUser = await db.query(updateQuery, [fileName, userId]);

      res.json({ message: 'Avatar uploaded successfully', user: updatedUser.rows[0] });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: 'Something went wrong.' });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const userId = req.userId;
    const { username } = req.body;

    // Check if username already exists
    const usernameExists = await db.query('SELECT * FROM users WHERE username = $1 AND id != $2', [username, userId]);

    if (usernameExists.rows.length > 0) {
      return res.json({ message: 'This username is already used' });
    }

    const updatedUser = await db.query(
      'UPDATE users SET username = $1 WHERE id = $2 RETURNING *',
      [username, userId]
    );

    if (updatedUser.rows.length === 0) {
      return res.json({ message: 'User not found' });
    }

    res.json({ user: updatedUser.rows[0], message: 'Username updated successfully' });
  } catch (error) {
    console.error('Error updating username:', error);
    res.json({ message: 'Internal Server Error' });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const userId = req.userId;
    const { email } = req.body;

    // Check if username already exists
    const usernameExists = await db.query('SELECT * FROM users WHERE email = $1 AND id != $2', [email, userId]);

    if (usernameExists.rows.length > 0) {
      return res.json({ message: 'This email is already used' });
    }

    const updatedUser = await db.query(
      'UPDATE users SET email = $1 WHERE id = $2 RETURNING *',
      [email, userId]
    );

    if (updatedUser.rows.length === 0) {
      return res.json({ message: 'User not found' });
    }

    res.json({ user: updatedUser.rows[0], message: 'email updated successfully' });
  } catch (error) {
    console.error('Error updating email:', error);
    res.json({ message: 'Internal Server Error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;
    const deletedUser = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

    if (deletedUser.rows.length === 0) {
      return res.json({ message: 'User not found' });
    }

    res.json({ user: deletedUser.rows[0], message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.json({ message: 'Internal Server Error' });
  }
};

export const activateAccount = async (req, res) => {
  try {
    const activationLink = req.params.link;

    // Обновляем статус активации в базе данных
    const updateActivationStatus = await db.query('UPDATE users SET isActivated = true WHERE activationLink = $1 RETURNING *', [activationLink]);

    if (updateActivationStatus.rows.length === 0) {
      return res.json({ message: 'Некорректная ссылка активации' });
    }

    res.json({ message: 'Успешно активировали аккаунт' });
  } catch (e) {
    console.error(e);
    res.json({ message: 'Произошла ошибка' });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.json({ message: "Пользователь с таким email не найден" });
    }

    const resetToken = uuidv4();
    const updateResetTokenQuery = 'UPDATE users SET resetPasswordToken = $1, resetPasswordExpires = $2 WHERE email = $3';
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration
    await db.query(updateResetTokenQuery, [resetToken, resetPasswordExpires, email]);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
      }
  });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Сброс пароля",
      text: `Для сброса пароля перейдите по ссылке: http://localhost:5173/resetpassword/${resetToken}`,
      html: `
        <div>
            <h1>Для сброса пароля перейдите по ссылке:</h1>
            <a href="http://localhost:5173/resetpassword/${resetToken}">http://localhost:5173/resetpassword/${resetToken}</a>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.json({ message: "Произошла ошибка при отправке письма" });
      } else {
        return res.json({
          message: "Письмо с инструкциями по сбросу пароля отправлено успешно",
        });
      }
    });
  } catch (e) {
    console.log(e)
    res.json({ message: "Произошла ошибка" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const user = await db.query('SELECT * FROM users WHERE resetPasswordToken = $1 AND resetPasswordExpires > $2', [resetToken, new Date()]);

    if (user.rows.length === 0) {
      return res.json({ message: "Срок действия токена истек или токен неверен" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatePasswordQuery = 'UPDATE users SET hashed_password = $1, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE resetPasswordToken = $2';
    await db.query(updatePasswordQuery, [hashedPassword, resetToken]);

    res.json({ message: "Пароль успешно изменен" });
  } catch (e) {
    console.log(e)
    res.json({ message: "Произошла ошибка" });
  }
};