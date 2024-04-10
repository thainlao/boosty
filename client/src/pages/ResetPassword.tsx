import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hoocs";
import '../styles/reset.css';
import { toast } from "react-toastify";
import { requestPasswordReset, resetPassword } from "../store/reducers/authSlice";

const ResetPassword = () => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState<string>('');
    const {status, isLoading} = useAppSelector((state) => state.authReducer);

    useEffect(() => {
        if (status) {
          toast(status);
    
          const clearMessage = setInterval(() => {
            toast('');
          }, 4500);
          return () => {
            clearInterval(clearMessage);
          };
        }
    
      }, [status]);

      const handleRequestReset = async () => {
        try {
            await dispatch(requestPasswordReset({email}));
            setEmail('');
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="reset">
            <h2>Для сброса пароля введите свой e-mail</h2>
            <div className="reset_container">
                <input
                type="email"
                placeholder="Введите ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleRequestReset}>Запросить сброс пароля</button>
            </div>
            {isLoading ? <div className='container'><div className="overlay"><div className="loader"></div></div></div> : ''}
        </div>
    )
}

export default ResetPassword;