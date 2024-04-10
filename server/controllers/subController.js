import db from '../db.js';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';

export const createSub = async (req, res) => {
    const { subname, content18plus} = req.body;
    const creatorId = req.userId;
    
    try {
        const user = await db.query('SELECT * FROM users WHERE id = $1', [creatorId]);
        if (user.rows.length === 0) {
            return res.json({ message: 'Данный пользователь не найден' });
        }

        const createdSub = await db.query(
            'INSERT INTO subs (subname, creator_id, content18plus) VALUES ($1, $2, $3) RETURNING *',
            [subname, creatorId, content18plus]
        );

        await db.query(
            'UPDATE users SET createdSubscription = array_append(createdSubscription, $1) WHERE id = $2',
            [subname, creatorId]
        );

        res.json({ sub: createdSub, message: 'Подписка успешно создана'})
    } catch (e) {
        console.error(e);
        res.json({ message: 'Произошла ошибка' });
    }
}

export const createAdditionalSub = async (req, res) => {
  const { subname } = req.params;
  const { add_sub_name, add_sub_price, add_sub_about } = req.body;
  const creatorId = req.userId;

  try {
    const user = await db.query('SELECT * FROM users WHERE id = $1', [creatorId]);
    if (user.rows.length === 0) {
        return res.json({ message: 'Данный пользователь не найден' });
    }

    const relatedSub = await db.query('SELECT * FROM subs WHERE subname = $1', [subname]);
    if (relatedSub.rows.length === 0) {
        return res.json({ message: 'Связанная подписка не найдена' });
    }

    const createdAdditionalSub = await db.query(
        'INSERT INTO additionalsub (add_sub_name, add_sub_about, add_sub_relatedsub, add_sub_price) VALUES ($1, $2, $3, $4) RETURNING *',
        [add_sub_name, add_sub_about, relatedSub.rows[0].id, add_sub_price]
    );

    await db.query(
        'UPDATE subs SET additionalsubs = array_append(additionalsubs, $1) WHERE id = $2',
        [createdAdditionalSub.rows[0].id, relatedSub.rows[0].id]
    );

    res.json({ additionalSub: createdAdditionalSub.rows[0], message: 'Дополнительная подписка успешно создана' });
} catch (e) {
    console.error(e);
    res.json({ message: 'Произошла ошибка' });
}
}

export const getAllAdditionalSubs = async (req, res) => {
  try {
      const subName = req.params.subname;

      const subsData = await db.query('SELECT additionalsubs FROM subs WHERE subname = $1', [subName]);
      if (subsData.rows.length === 0 || !subsData.rows[0].additionalsubs) {
          return res.status(404).json({ message: 'No additional subscriptions found for the specified subscription' });
      }

      const additionalSubIds = subsData.rows[0].additionalsubs;

      // Fetch all additional subs based on the array of IDs
      const additionalSubs = await db.query('SELECT * FROM additionalsub WHERE id = ANY($1)', [additionalSubIds]);

      res.json({ additionalSubs: additionalSubs.rows });
  } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Internal server error' });
  }
};



export const getSubData = async (req, res) => {
    try {
        const subName = req.params.subname;
        const result = await db.query('SELECT * FROM subs WHERE subname = $1', [subName]);
        
        // Check if the sub exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Sub not found' });
        }

        const sub = result.rows[0];
        res.json({ sub });
      } catch (e) {
        console.error(e);
        res.json({ message: 'Произошла ошибка' });
      }
}

export const isSubnameAvalible = async (req, res) => {
    try {
        const {subscription_name} = req.body;
        const result = await db.query('SELECT * FROM subs WHERE subname = $1', [subscription_name]);
        
        if (result.rows.length === 0) {
            return res.json({ message: 'Sub not found' });
        }

        const sub = result.rows[0];
        res.json({ sub });
    } catch (e) {
        res.json({ message: 'Произошла ошибка' });
    }
}

export const uploadSubAvatar = async (req, res) => {
  const { subname } = req.params;
  try {
    if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name;
            const __dirname = dirname(fileURLToPath(import.meta.url));
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName));

            const updateQuery = 'UPDATE subs SET sub_avatar = $1 WHERE subname = $2 RETURNING *';
            const updatedUser = await db.query(updateQuery, [fileName, subname]);

            res.json({ message: 'Avatar uploaded successfully', user: updatedUser.rows[0] });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: 'Something went wrong.' });
  }
};

export const uploadSubBackground = async (req, res) => {
  const { subname } = req.params;
  try {
    if (req.files) {
            let fileName = Date.now().toString() + req.files.image.name;
            const __dirname = dirname(fileURLToPath(import.meta.url));
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName));

            const updateQuery = 'UPDATE subs SET sub_background = $1 WHERE subname = $2 RETURNING *';
            const updatedUser = await db.query(updateQuery, [fileName, subname]);

            res.json({ message: 'Avatar uploaded successfully', user: updatedUser.rows[0] });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: 'Something went wrong.' });
  }
};

export const getAllSubsData = async (req, res) => {
  try {
      const result = await db.query('SELECT * FROM subs');
      
      // Check if there are any subs
      if (result.rows.length === 0) {
          return res.json({ message: 'No subs found' });
      }

      const subs = result.rows;
      res.json({ subs });
  } catch (e) {
      console.error(e);
      res.json({ message: 'Произошла ошибка' });
  }
};

export const changeSubDescription = async (req, res) => {
  try {
    const { sub_about } = req.body;
    const { subname } = req.params;

    const updateQuery = 'UPDATE subs SET sub_about = $1 WHERE subname = $2 RETURNING *';
    const values = [sub_about, subname];

    const result = await db.query(updateQuery, values);

    if (result.rowCount === 1) {
      res.json({ success: true, message: 'Sub description updated successfully' });
    } else {
      res.json({ success: false, message: 'Sub not found' });
    }

  } catch (e) {
    console.error(e);
    res.json({ success: false, message: 'Internal Server Error' });
  }
};

export const subscribeToSub = async (req, res) => {
  const { subname } = req.params;
  const userId = req.userId;

  try {
    // Check if the sub exists
    const subResult = await db.query('SELECT * FROM subs WHERE subname = $1', [subname]);

    if (subResult.rows.length === 0) {
      return res.status(404).json({ message: 'Sub not found' });
    }

    const sub = subResult.rows[0];

    // Check if the user is already subscribed
    if (sub.buyers.includes(userId)) {
      return res.status(400).json({ message: 'User is already subscribed to this sub' });
    }

    // Update the sub's buyers array
    const updatedBuyers = [...sub.buyers, userId];
    const updateSubQuery = 'UPDATE subs SET buyers = $1 WHERE id = $2 RETURNING *';
    const updatedSub = await db.query(updateSubQuery, [updatedBuyers, sub.id]);

    // Update the user's subscriptions array
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];
    const updatedSubscriptions = [...user.subscriptions, updatedSub.rows[0].id];
    const updateUserQuery = 'UPDATE users SET subscriptions = $1 WHERE id = $2 RETURNING *';
    const updatedUser = await db.query(updateUserQuery, [updatedSubscriptions, userId]);

    res.json({ message: 'Successfully subscribed to the sub', user: updatedUser.rows[0], sub: updatedSub.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'An error occurred while subscribing to the sub' });
  }
};

export const unsubscribeFromSub = async (req, res) => {
  const { subname } = req.params;
  const userId = req.userId;

  try {
    // Check if the sub exists
    const subResult = await db.query('SELECT * FROM subs WHERE subname = $1', [subname]);

    if (subResult.rows.length === 0) {
      return res.status(404).json({ message: 'Sub not found' });
    }

    const sub = subResult.rows[0];

    // Check if the user is subscribed to the sub
    if (!sub.buyers.includes(userId)) {
      return res.status(400).json({ message: 'User is not subscribed to this sub' });
    }

    // Remove the user from the sub's buyers array
    const updatedBuyers = sub.buyers.filter((buyerId) => buyerId !== userId);
    const updateSubQuery = 'UPDATE subs SET buyers = $1 WHERE id = $2 RETURNING *';
    const updatedSub = await db.query(updateSubQuery, [updatedBuyers, sub.id]);

    // Remove the sub from the user's subscriptions array
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];
    const updatedSubscriptions = user.subscriptions.filter((subId) => subId !== updatedSub.rows[0].id);
    const updateUserQuery = 'UPDATE users SET subscriptions = $1 WHERE id = $2 RETURNING *';
    const updatedUser = await db.query(updateUserQuery, [updatedSubscriptions, userId]);

    res.json({ message: 'Successfully unsubscribed from the sub', user: updatedUser.rows[0], sub: updatedSub.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'An error occurred while unsubscribing from the sub' });
  }
};
