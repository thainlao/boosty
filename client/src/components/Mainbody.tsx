import { useEffect, useState } from 'react';
import '../styles/mainbody.css';
import { useAppDispatch } from '../store/hoocs';
import { useNavigate } from 'react-router-dom';
import { getallsubsdata } from '../store/reducers/subSlice';
import { ISub } from '../types/types';
const Mainbody = () => {

    const [subData, setSubData] = useState<any>([]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [visibleSubs, setVisibleSubs] = useState<number>(3);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dispatch(getallsubsdata());
                setSubData(data.payload.subs);
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, [dispatch, navigate]);

    const handlePrevClick = () => {
        setVisibleSubs((prevVisibleSubs) => {
            const newVisibleSubs = (prevVisibleSubs - 3 + subData.length) % subData.length;
            return newVisibleSubs;
        });
    };

    const handleNextClick = () => {
        setVisibleSubs((prevVisibleSubs) => {
            const newVisibleSubs = (prevVisibleSubs + 3) % subData.length;
            return newVisibleSubs;
        });
    };

    return (
        <div>
            <div className="mainbody">
                <div className='firts_section'>

                    <div className='text_first_section'>
                        <h2>Твой талант стоит денег</h2>
                        <h3>Лучший способ заработка и общения с аудитория для авторов контента</h3>

                        <div className='images_section'>
                            <div>
                                <img src='https://static.boosty.to/assets/images/star.4er8X.svg'/>
                                <h4>Уровни подписки</h4>
                            </div>

                            <div>
                                <img src='https://static.boosty.to/assets/images/stream.6GJNH.svg'/>
                                <h4>Стримы</h4>
                            </div>

                            <div>
                                <img src='https://static.boosty.to/assets/images/coins.5hsM8.svg'/>
                                <h4>Донаты</h4>
                            </div>

                            <div>
                                <img src='https://static.boosty.to/assets/images/donate.5qJWf.svg'/>
                                <h4>Сбор средств</h4>
                            </div>

                            <div>
                                <img src='https://static.boosty.to/assets/images/messengers.USauH.svg'/>
                                <h4>Доступ к закрытым чатам</h4>
                            </div>

                            <div>
                                <img src='https://static.boosty.to/assets/images/stat.32z9E.svg'/>
                                <h4>Статистика блога</h4>
                            </div>

                            <div>
                                <img src='https://static.boosty.to/assets/images/private.Wog5A.svg'/>
                                <h4>Закрытые блоги</h4>
                            </div>
                        </div>
                    </div>

                    <img src='https://static.boosty.to/assets/images/front-image.3Sdzd.svg'/>
                </div>

                <div className='second_section'>
                    <h2>Как это работает?</h2>

                    <div className='second_part'>
                        <div className='second_part1'>
                            <img src='https://static.boosty.to/assets/images/site.3UX0S.svg' />
                            <div className='second_part_text'>
                                <h1>Зритель</h1>
                                <h2>400 Р в месяц</h2>
                                <h3>Вы получите доступ ко всем вышедшим сериям и сможете смотреть новые, сразу после их выхода.</h3>
                                <button>ПОДПИСАТЬСЯ</button>
                            </div>
                        </div>

                        <div className='second_part2'>
                            <h1>ШАГ 1</h1>
                            <h2>Настройте свою страницу и уровни подписки</h2>
                            <h3>Зарегистрируйтесь и настройте вашу страницу в Boosty. Продумайте уровни подписки, от самого дешевого до привилегированного. Каждый уровень предлагает особые условия и преимущества вашим фанатам. Подумайте, что вы реально сможете давать регулярно и чему будут рады ваши фанаты. Не усложняйте!</h3>
                        </div>
                    </div>

                    <div className='second_part'>

                        <div className='second_part2'>
                            <h1>ШАГ 2</h1>
                            <h2>Расскажите своим подписчикам, что вы теперь есть на Boosty</h2>
                            <h3>Сделайте посты во всех ваших основных соц.сетях, чтобы оповестить всех ваших подписчиков. Boosty - это место, где рождаются особые отношения между вами и вашими самыми активными фанатами - теми, кто хочет чего-то большего, чем просто следить за вами в социальных сетях.</h3>
                        </div>

                        <div className='second_part1'>
                            <div className='second_part_messages'>
                                <div>
                                    <h2>Ирина Андреева</h2>
                                    <h3>Всем привет! Теперь вы можете поддерживать меня на Boosty</h3>
                                </div>

                                <div>
                                    <h2>Андрей Иванов</h2>
                                    <h3>С радостью поддержу тебя!</h3>
                                </div>

                                <div>
                                    <h2>Анастасия Строганова</h2>
                                    <h3>Круто! Будут ли бонусы для подписчиков?</h3>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
        
                <div className='thirdsection'>
                    <div>
                        <h2>Зарабатывают с нами</h2>
                        {/*<div className='third_grid_section'>
                            <li>
                                {subData.slice(visibleSubs - 3, visibleSubs).map((sub: ISub) => (
                                    <div key={sub.id}>
                                        <img className={sub.sub_avatar === null ? 'avatarsub_null' : ''} src={`http://localhost:5000/${sub.sub_avatar}`} />
                                        <h5>{sub.subname}</h5>
                                        <h4>{sub.buyers.length} подписчиков</h4>
                                        <a href={sub.subname ?? '#'}>Перейти в блог</a>
                                    </div>
                                ))}
                            </li>
                        </div>*/}
                        <div className='third_buttons'>
                            <button onClick={handlePrevClick}>&#9666;</button>
                            <button onClick={handleNextClick}>&#9656;</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mainbody