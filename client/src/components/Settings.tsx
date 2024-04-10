import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hoocs';
import '../styles/Settings.css';
import { DeleteUser, checkIsAuth, getMe, logout, updateEmail, updateUsername, uploadAvatar } from '../store/reducers/authSlice';
import { useNavigate } from 'react-router-dom';
import gear from '../assets/Gear.png';
import { toast } from 'react-toastify';
import check from '../assets/check.png';

const Settings = () => {
    const user = useAppSelector((state) => state.authReducer.user);
    const dispatch = useAppDispatch();
    const {status} = useAppSelector((state) => state.authReducer);
    const isAuth = useAppSelector((state) => checkIsAuth(state.authReducer))
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.username || 'Your Name');
            setEmail(user.email || 'Your Email');
        }
    }, [user]);

    useEffect(() => {
        dispatch(getMe())
    }, [dispatch]);

    useEffect(() => {
        if (isAuth === false) {
            navigate('/')
        }
    })

    const userImgWord = user?.username?.[0]?.toUpperCase();

    //avatar 
    const [img, setImg] = useState<any>('');
    const [isImgChanging, setIsImgChanging] = useState<boolean>(false);

    useEffect(() => {
        const uploadImage = async () => {
            if (img) {
                const data = new FormData();
                data.append('image', img);
                dispatch(uploadAvatar(data));
            }
        }

        uploadImage();
    }, [img, dispatch, setImg]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newImg = e.target.files?.[0];

        if (newImg) {
            const data = new FormData();
            data.append('image', newImg);

            try {
                await dispatch(uploadAvatar(data));
                setImg(newImg);
                toast('Фото успешно изменено')
                setIsImgChanging(false)
            } catch (error) {
                console.error("Ошибка при загрузке изображения:", error);
            }
        }
    };

    const fileInputRefImg = useRef<HTMLInputElement>(null);

    const handleButtonClickImg = () => {
      if (fileInputRefImg.current) {
          fileInputRefImg.current.click();
      }
    };

    //email, name validation
    const [name, setName] = useState(user?.username || 'Your Name');
    const [email, setEmail] = useState(user?.email || 'Your Email');

    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);

    const handleEditName = () => {
        setIsEditingName((prev) => !prev);
    };

    useEffect(() => {
        if (status !== null) {
            toast(status)
        }
    },[dispatch, user, status])

    const handleNameConfirm = async () => {
        try {
            await dispatch(updateUsername({username: name}))
            setIsEditingName(false);
        } catch (e) {
            console.log(e)
        }
    };

    const handleEditEmail = async () => {
        setIsEditingEmail((prev) => !prev);
    }

    const handleEmailConfirm = async () => {
        try {
            await dispatch(updateEmail({email}))
            setIsEditingEmail(false);
        } catch (e) {
            console.log(e)
        }
    };

    //deleting
    const [isDelitingAccount, setIsDelitingAccount] = useState<boolean>(false);
    const [checkboxClicked, setCheckboxClicked] = useState<boolean>(false);

    const handleOpenDelAcc = async () => {
        try {
            await dispatch(DeleteUser());
            dispatch(logout());
            window.localStorage.removeItem('token');
            navigate('/')
        } catch (e) {
            console.log(e)
        }
        setCheckboxClicked(false)
        setIsDelitingAccount(false)
    }

    const checkboxTrue = () => {
        setCheckboxClicked((prev) => !prev);
    }

    return (
        <div className='setting'>
            <div className="setting_line"></div>

            <div className='setting_underline_container'>
                <div className='setting_under_line'></div>
                <h3>Boosty</h3>
                <div className='setting_under_line'></div>
            </div>

            {!user?.isactivated === true ?
                <div className='isactivated'>
                    <h2>Вы не активировали аккаунт, для доступа ко всем функциям подтвердите аккаунт</h2>
                </div>    
            :''}

            <div className='setting_info'>
                <div className='profile_img_section'>
                <h4>Фото профиля</h4>

                    <div style={{position:'relative'}}>
                        {img ? (
                            <img className='img_ava' src={URL.createObjectURL(img)} alt="User Avatar" />
                        ) : user?.avatar ? (
                            <img className='img_ava_photo' src={`http://localhost:5000/${user.avatar}`} alt="User Avatar" />
                        ) : (
                            <div>
                                <img className='img_ava' />
                                <span>{userImgWord}</span>
                            </div>
                        )}
                        <div className='changegearimg'>
                            <button style={{marginRight: '20px'}} onClick={handleButtonClickImg} className='change_img_but_ava'>
                                <img className='change_img' src={gear} />
                            </button>

                            <input
                                type='file'
                                onChange={handleImageChange}
                                ref={fileInputRefImg}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    {isImgChanging 
                    ? <div>
                    <label>
                        <input type="file" onChange={handleImageChange} name='image' />
                    </label>
                    </div> : ''}
                    
                </div>

                <div>
                    <h4>Имя</h4>
                    <div className='input_change_value'>
                        {isEditingName ? (
                            <div>
                                <input
                                    style={{ border: '1px solid green', color: 'green' }}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />  
                                <img onClick={handleNameConfirm} className='setting_mark' src={check} />                                 
                            </div>
                         
                        ):(
                            <div>
                                <input value={name}/>
                                <img onClick={handleEditName} className='setting_gear' src={gear} />
                            </div>
                        )}
                    </div>
                    <h5>Имя будет показываться на вашей странице</h5>
                </div>

                <div>
                    <h4>E-mail</h4>
                    <div className='input_change_value'>
                        {isEditingEmail ? (
                            <div>
                                <input
                                    style={{ border: '1px solid green', color: 'green' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />  
                                <img onClick={handleEmailConfirm} className='setting_mark' src={check} />                                 
                            </div>
                         
                        ):(
                            <div>
                                <input value={email}/>
                                <img onClick={handleEditEmail} className='setting_gear' src={gear} />
                            </div>
                        )}
                    </div>
                    <h5>Используется для получения уведомления, нельзя использовать для входа в аккаунт</h5>
                </div>

                <div className='delete'>
                    <h6 onClick={() => setIsDelitingAccount(true)}>Удалить аккаунт</h6>
                </div>
            </div>

            <div className='setting_underline_container'>
                <div className='setting_under_line'></div>
                <h3>Boosty</h3>
                <div className='setting_under_line'></div>
            </div>

            <div className='sub_info'>
                <h4>Подписки</h4>
                {user?.followers.length === 0 ? <h5>У вас нет подписок</h5> 
                : <div></div>}
            </div>
        {isDelitingAccount ? 
        <div className='deleting_account'>
            <h1>Вы точно хотите удалить профиль?</h1>
            <h2>Подтвердите удаление профиля. Вы потеряете доступ ко всему контенту без возможности восстановления</h2>

            <div className='del_input'>
                <input onClick={checkboxTrue} type='checkbox' /><span>Да, я хочу удалить свой профиль</span>
            </div>

            <div className='del_but'>
                <button
                style={checkboxClicked ? {} : {background: 'rgb(80, 75, 75)', cursor: 'default'}}
                disabled={!checkboxClicked}
                className='del_acc_but'
                onClick={handleOpenDelAcc}
                >
                УДАЛИТЬ
                </button>
                <button className='can_acc_but' onClick={() => setIsDelitingAccount(false)}>ОТМЕНИТЬ</button>
            </div>
        </div> : 
        <div></div>}
        </div>
    )
}

export default Settings