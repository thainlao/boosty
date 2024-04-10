import '../styles/modal.css';
import React, { useState } from 'react';
import { ModalProps } from '../types/types';
import { useAppDispatch } from '../store/hoocs';
import { signupUser } from '../store/reducers/authSlice';
import { useNavigate } from 'react-router-dom';

const RegisterModal: React.FC<ModalProps> = ({close, changemodal}) => {
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleRegister = () => {
        try {
            dispatch(signupUser({email, username, password}));
            setPassword('');
            setEmail('');
            setUsername('');
            navigate('/settings')
            close();
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className='modal'>
            <h2>Регистрация пользователя</h2>

                <form onSubmit={(e) => e.preventDefault()} className='text_area'>
                    <div>
                        <h3>Почта</h3>
                        <input
                            type='email'
                            name='email'
                            value={email}
                            placeholder='Ваш Email...'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <h3>Имя пользователя</h3>
                        <input
                            type='text'
                            name='username'
                            value={username}
                            placeholder='Ваше имя...'
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <h3>Пароль</h3>
                        <input
                            type='password'
                            name='password'
                            value={password}
                            placeholder='Ваш пароль...'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button onClick={handleRegister} type='submit'>Регистрация</button>
                </form>

                <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                    <h2>У вас уже есть аккаунт?</h2>
                    <button onClick={changemodal} className='modal_but'>Войти</button>
                </div>

            <button onClick={close} className='close_modal'></button>
        </div>
    )
}

export default RegisterModal