import { useEffect, useState } from 'react';
import '../styles/modal.css';
import { useAppDispatch} from '../store/hoocs';
import { createSub, isSubNameAvalibe } from '../store/reducers/subSlice';
import { useNavigate } from 'react-router-dom';
import { AuthorPros } from '../types/types';

const BecomeAuthor: React.FC<AuthorPros> = ({close}) => {
    const defaultLink = 'boosty.to/';
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState('');
    const [firstCheckbox, isFirstCheckbox] = useState<boolean>(false);
    const [secondCheckbox, isSecondCheckbox] = useState<boolean>(false);
    const [subnameAvalible, setSubnameAvalible] = useState<boolean>(true);
    
    useEffect(() => {
        const timerId = setTimeout(async () => {
            try {
                setSubnameAvalible(false);

                const isAvailable = await dispatch(isSubNameAvalibe({ subscription_name: inputValue }));

                if (isAvailable.payload.message) {
                    setSubnameAvalible(true);
                } else {
                    setSubnameAvalible(false);
                }
            } catch (error) {
                console.error('Error checking subname availability:', error);
            }
        }, 1000);

        return () => clearTimeout(timerId);
    }, [inputValue, dispatch]);

    const handleBecomeAuthor = async () => {
        try {
            await dispatch(createSub({ subname: inputValue, content18plus: firstCheckbox }));
            close();
            navigate(`/${inputValue}`)
        } catch (e) {
            console.log(e)
        }
    }

    const handleLinkInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.substring(defaultLink.length);
        setInputValue(inputValue);
    };

    return (
        <div className='modal_author'>
            <div>
                <img src='https://static.boosty.to/assets/images/cover-bg.2USxd.png' />
            </div>

            <div className='modal_author_text'>
            <h2>Стать автором</h2>

                <div>
                    <h3>Получи постоянную поддержку своей аудитории.</h3>
                    <h3>Твори, а мы позаботимся о всем остальном</h3>
                </div>

                <h3>Время забустить свой талант!</h3>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <h4>Придумайте адресс вашей страницы</h4>
                        <input
                            value={defaultLink + inputValue}
                            onChange={handleLinkInput}
                            style={subnameAvalible === true ? {color: 'green'} : {color: 'red'}}
                        />
                        {inputValue.length > 3 
                        ?
                        <div>
                        {subnameAvalible === true ? (
                            <span style={{ color: 'green' }}>Данное название доступно</span>
                        ) : (
                            <span style={{ color: 'red' }}>Данное название занято</span>
                        )}
                        </div> 
                        : ''}
                        
                    </div>

                    <div className='modal_author_checkbox'>
                        <input onChange={() => isFirstCheckbox(!firstCheckbox)} type='checkbox' />
                        <h2>Мой блок будет содержать "контент для взрослых"</h2>
                    </div>

                    <div className='modal_author_checkbox'>
                        <input type='checkbox' onChange={() => isSecondCheckbox(!secondCheckbox)} />
                        <h2>Согласен с условиями использования и политикой конфиденциальности</h2>
                    </div>

                    <button onClick={handleBecomeAuthor} disabled={!secondCheckbox || inputValue.length < 3 || !subnameAvalible}>СТАТЬ АВТОРОМ</button>
                    
                </form>
            </div>
            <button onClick={close} className='close_modal'></button>
        </div>
    )
}

export default BecomeAuthor;