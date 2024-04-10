import { useEffect, useState } from 'react';
import '../styles/modal.css';
import { ModalProps } from '../types/types';
import { useAppDispatch, useAppSelector } from '../store/hoocs';
import { loginUser } from '../store/reducers/authSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const LoginModal: React.FC<ModalProps> = ({close, changemodal}) => {
    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    
    const dispatch = useAppDispatch();
    const {status} = useAppSelector((state) => state.authReducer);
    const navigate = useNavigate();

    const handleLogin = () => {
        try {
            dispatch(loginUser({email, password}))
            setPassword('');
            setEmail('');
            close();
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (status) {
            toast(status)
        }
    },[status, handleLogin])

    const handleNavigate = () => {
        navigate('/resetpassword');
        close();
    }

    return (
        <div className='modal'>
            <h2>Войти</h2>

            <form onSubmit={(e) => e.preventDefault()} className='text_area'>
                <div>
                    <h3>E-mail</h3>
                    <input 
                    placeholder='Ваш Email...' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <h3>Password</h3>
                    <input 
                    placeholder='Ваш пароль...' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button onClick={handleLogin} type='submit'>Вход</button>
            </form>

            <button onClick={close} className='close_modal'></button>

            <div>
                <h2>Забыли пароль?</h2>
                <button onClick={handleNavigate} className='modal_but'>Восстановить</button>
            </div>

            <div>
                <h2>У вас нет аккаунта?</h2>
                <button onClick={changemodal} type='submit' className='modal_but'>Создать</button>
            </div>
        </div>
    )
}

export default LoginModal