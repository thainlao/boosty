import { useParams } from "react-router-dom";
import { useAppDispatch } from "../store/hoocs";
import { useEffect } from "react";
import { activateAccount } from "../store/reducers/authSlice";

const ActivationLink = () => {
    const dispatch = useAppDispatch();
    const { link } = useParams();

    useEffect(() => {
        if (link) {
            dispatch(activateAccount(link));
        }
    },[dispatch, link])

    return (
        <div className='activate'>
            <h2>Ваш аккаунт успешно активирован!</h2>
            <a style={{color: 'blue', cursor: 'pointer'}} href='/'>Перейти</a>
        </div>
    )
}

export default ActivationLink;