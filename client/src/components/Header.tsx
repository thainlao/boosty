import { useEffect, useState } from 'react';
import '../styles/header.css';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import usericon from '../assets/pngwing.com (1).png';
import { useAppDispatch, useAppSelector } from '../store/hoocs';
import { checkIsAuth, getMe, logout } from '../store/reducers/authSlice';
import BecomeAuthor from './BecomeAuthor';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [showBecomePartnerModal, setShowBecomePartnerModal] = useState<boolean>(false)

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        setShowRegisterModal(true);
        setShowLoginModal(false);
    };
  
    const handleLoginClick = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    const handleBecomeAuthor = () => {
        setShowBecomePartnerModal(true);
    }
  
    const closeModal = () => {
        setShowRegisterModal(false);
        setShowLoginModal(false);
        setShowBecomePartnerModal(false);
    }
  
    const changeModal = () => {
        setShowRegisterModal(prevState => !prevState);
        setShowLoginModal(prevState => !prevState);
    }

    const isAuth = useAppSelector((state) => checkIsAuth(state.authReducer))

    const handleLogout = async () => {
        dispatch(logout());
        window.localStorage.removeItem('token');
        dispatch(getMe());
    }

    const user = useAppSelector((state) => state.authReducer.user);

    //subscription
    const [isUserHaveSubPage, setIsUserHaveSubPage] = useState<boolean>(false);
    
    useEffect(() => {
        if (user?.createdsubscription.length === 0) {
            setIsUserHaveSubPage(false)
        } else {
            setIsUserHaveSubPage(true)
        }
    },[user])


    return (
        <div>
            <div className='header'>
                <div className='header_left'>
                    <a href='/'>
                    <img src='https://static.boosty.to/assets/images/logo.86hCA.svg' style={{cursor: 'pointer'}}/>
                    </a>
                </div>

                <div className='header_right'>
                    {isAuth ?
                    <div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                            {isUserHaveSubPage ? <button onClick={() => user?.createdsubscription && navigate(user.createdsubscription.join(''))} className='become_author'>ПЕРЕЙТИ {user?.createdsubscription.join('').toUpperCase()}</button> : <button onClick={handleBecomeAuthor} className='become_author'>СТАТЬ АВТОРОМ</button>}
                            <a href='/settings'>
                            <img src={user?.avatar === null || undefined  ? usericon : `http://localhost:5000/${user?.avatar}`} alt='logo' loading='lazy'/>
                            </a>
                            <button onClick={handleLogout} className='login_button'>ВЫЙТИ</button>
                            <h2></h2>
                        </div>
                    </div> : 
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button onClick={handleRegisterClick}>РЕГИСТРАЦИЯ</button>
                        <button onClick={handleLoginClick} className='login_button'>ВОЙТИ</button>
                    </div>}
                        
                </div>
                
                {showRegisterModal && <RegisterModal changemodal={changeModal} close={closeModal} />}
                {showLoginModal && <LoginModal changemodal={changeModal} close={closeModal} />}
                {showBecomePartnerModal && <BecomeAuthor close={closeModal} />}
            </div>
            <div className='headerline'></div>
        </div>
    )
}

export default Header;