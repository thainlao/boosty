import { useParams } from 'react-router-dom';
import '../styles/subdashboard.css'
import { useAppDispatch, useAppSelector } from '../store/hoocs';
import { useEffect, useRef, useState } from 'react';
import { changeSubDescription, getSignSubData, getSubData, sibToSub, unsibToSub, uploadsubAvatar, uploadsubBackground } from '../store/reducers/subSlice';
import { toast } from 'react-toastify';
import gear from '../assets/Gear.png';
import check from '../assets/check.png';
import CreatePost from './CreatePost';
import CreateSign from './CreateSign';
import { AddiSUB } from '../types/types';

const SubDashboard = () => {
    const params = useParams();
    const dispatch = useAppDispatch();
    const sub = useAppSelector((state) => state.subReducer.sub);
    const user = useAppSelector((state) => state.authReducer.user);
    const {status} = useAppSelector((state) => state.subReducer);

    const [isSubOwner, setIsSubOwner] = useState<boolean>(false);

    useEffect(() => {
        if (user?.id === sub?.creator_id) {
            setIsSubOwner(true)
        } else {
            setIsSubOwner(false)
        }
    },[user, sub])

    useEffect(() => {
        dispatch(getSubData(params.subname));
    }, [dispatch, params.subname, user, status]);

    //Avatar
    const [img, setImg] = useState<any>('');
    const userImgWord = sub?.subname?.[0]?.toUpperCase();
    const subNameParams: any = params.subname;

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newImg = e.target.files?.[0];
      
        if (newImg) {
          try {
            await dispatch(uploadsubAvatar({ dataInfo: newImg, subNameParams }));
            setImg(newImg);
            toast('Фото успешно изменено');
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

      //background
      const [backGround, setBackGround] = useState<any>('');
  
      const handleBGChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
          const newBG = e.target.files?.[0];
        
          if (newBG) {
            try {
              await dispatch(uploadsubBackground({ dataInfo: newBG, subNameParams }));
              setBackGround(newBG);
              toast('Фото успешно изменено');
            } catch (error) {
              console.error("Ошибка при загрузке изображения:", error);
            }
          }
        };

        const fileInputRef = useRef<HTMLInputElement>(null);

        const handleButtonClick = () => {
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        };

        useEffect(() => {
            if (status !== null) {
                toast(status)
            }
        },[dispatch, user, status])

        //edit name
        const [isNameEditing, setIsNameEditing] = useState<boolean>(false);
        const [subdescription, setSubDescription] = useState(sub?.sub_about || '');

        useEffect(() => {
            if (sub) {
                setSubDescription(sub?.sub_about || 'Your Description');
            }
        }, [user]);

        const handleChangeDescription = () => {
            try {
                dispatch(changeSubDescription({ sub_about: subdescription, subNameParams }));
                setIsNameEditing(false);
            } catch (e) {
                console.log(e)
            }
        }

        //isUserSigned
        const signToSub = async () => {
            try {
                await dispatch(sibToSub({subNameParams}));
            } catch (e) {
                console.log()
            }
        }

        const unsignToSub = async () => {
            try {
                await dispatch(unsibToSub({subNameParams}));
            } catch (e) {
                console.log()
            }
        }

        const [createPostModal, setCreatePostModal] = useState<boolean>(false);
        const [createSignModal, setCreateSignModal] = useState<boolean>(false);

        const onCloseModal = () => {
            setCreatePostModal(false);
        }

        const onCloseSignModal = () => {
            setCreateSignModal(false);
        }

        const [signSubs, setSignSubs] = useState<AddiSUB[]>([]);

        useEffect(() => {
            const fetchData = async () => {
              try {
                const data = await dispatch(getSignSubData({ subNameParams }));
                setSignSubs(data.payload.additionalSubs);
              } catch (e) {
                console.log(e);
              }
            };
          
            fetchData();
          }, [user, sub, dispatch, subNameParams]);

          console.log(signSubs)

    return (
        <div className='subdashboard'>
            <div className='subdashlogo'>
                {backGround ? (
                        <img src={URL.createObjectURL(backGround)} alt="sub bg" className='subdash_logo' />
                    ) : sub?.sub_background ? (
                        <img src={`http://localhost:5000/${sub.sub_background}`} className='subdash_logo' alt="sub bg" />
                    ) : (
                        <div>
                            <img className='subdash_logo_empty' />
                        </div>
                    )}
                {isSubOwner ?
                <div className='change_bg'>
                    <button onClick={handleButtonClick} className='change_img_but'>
                        <img className='change_img' src={gear} />
                    </button>
                    <h6 style={{color: 'rgb(44, 44, 44)'}}>1500 x 500</h6>

                    <input
                        type='file'
                        onChange={handleBGChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                </div>
                : <div></div>}
            </div>
            

            <div className='subdashboard_section'>
                <div className='subdashboard_left'>
                {img ? (
                        <img className='subdashboard_left_avatar' src={URL.createObjectURL(img)} alt="sub Avatar" />
                    ) : sub?.sub_avatar ? (
                        <img className='subdashboard_left_avatar' src={`http://localhost:5000/${sub?.sub_avatar}`} alt="sub Avatar" />
                    ) : (
                        <div className='subdashboard_noavatar'>
                            <img className='subdashboard_left_avatar_noimg' />
                            <span>{userImgWord}</span>
                        </div>
                    )}
                {isSubOwner ?
                <div className='changegearimg'>
                    <button onClick={handleButtonClickImg} className='change_img_but_ava'>
                        <img className='change_img' src={gear} />
                    </button>

                    <input
                        type='file'
                        onChange={handleImageChange}
                        ref={fileInputRefImg}
                        style={{ display: 'none' }}
                    />
                </div>
                : <div></div>}

                    <div style={{display: 'flex', flexDirection: 'column', alignItems:'center'}}>
                        <h1>{sub && sub.buyers && sub.buyers.length}</h1>
                        <h2>подписчика</h2>
                    </div>

                    {sub?.buyers && user?.id && sub.buyers.includes(user.id) ?
                    <button className='subdashboard_left_button_sign' onClick={unsignToSub}>Отписаться</button>
                    : <button className='subdashboard_left_button_unsign' onClick={signToSub}>Подписаться</button>
                    }
                </div>

                <div className='subdashboard_center'>
                

                <div className='subdasglogo_text'>
                <h2 style={{fontWeight: '500'}}>{sub?.subname}</h2>
                    <div className='edit_name'>
                        {!isNameEditing ?
                        <h2>{sub?.sub_about === null ? 'Добавьте описание ' : sub?.sub_about}</h2> :
                        <div>
                            <input value={subdescription || ''} onChange={(e) => setSubDescription(e.target.value)} />
                            {isSubOwner ? <img src={check} onClick={handleChangeDescription} /> : ''}
                        </div>}
                        {isSubOwner ? <button onClick={() => setIsNameEditing((prev) => !prev)}>edit</button> : ''}
                    </div>
                </div>

                <div className='subdashboard_center_part'>
                    <h1>ОБ АВТОРЕ</h1>
                    <div className='line_subdash'></div>

                    <div className='subdashboard_center_part_center'>
                        <button onClick={() => setCreatePostModal((prev) => !prev)}>СОЗДАТЬ ПОСТ</button>
                    </div>
                </div>

                </div>

                <div className='subdashboard_right'>

                    <div className='subdasglogo_text'>
                        <h2>{sub?.subname}</h2>
                        <h3>Различные уровни подписок</h3>
                    </div>

                    <div className='subdashboard_right_part'>
                        <h1>УРОВНИ ПОДПИСКИ</h1>
                        <div className='line_subdash'></div>

                        
                        <div className='subdashboard_center_part_center'>
                        <button onClick={() => setCreateSignModal((prev) => !prev)}>СОЗДАТЬ ПОДПИСКУ</button>

                            <div className='sign_subs'>
                                {signSubs.map((addSub: AddiSUB) => (
                                    <div key={addSub.id}>
                                        <h1>{addSub.add_sub_name}</h1>
                                        <h3>{addSub.add_sub_price}</h3>
                                        <h2>{addSub.add_sub_about}</h2>

                                        <button>ПОДПИСАТЬСЯ</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            {createPostModal && <CreatePost onCloseModal={onCloseModal} />}
            {createSignModal && <CreateSign onCloseSignModal={onCloseSignModal}/>}
        </div>
    )
}

export default SubDashboard;