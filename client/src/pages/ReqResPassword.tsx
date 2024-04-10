import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hoocs";
import '../styles/reset.css';
import { useParams } from "react-router-dom";
import { resetPassword } from "../store/reducers/authSlice";
import { toast } from "react-toastify";

const ReqResPassword = () => {
  const dispatch = useAppDispatch();
  const [newPassword, setNewPassword] = useState("");
  const { resetToken } = useParams();
  const {status, isLoading} = useAppSelector((state) => state.authReducer)
   

    const handleResetPassword = async () => {
      try {
        await dispatch(resetPassword({ resetToken, newPassword }));
      } catch (e) {
        console.log(e);
      }
    };

    useEffect(() => {
      if (status) {
        toast(status)
      }
    },[])

    return (
      <div className="reset">
      <h2>Введите свой новый пароль</h2>
      <div className="reset_container">
        <h2>Сброс пароля</h2>
        <input
          type="password"
          placeholder="Введите новый пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleResetPassword}>Сбросить пароль</button>
      </div>
      {isLoading ? <div className='container'><div className="overlay"><div className="loader"></div></div></div> : ''}
    </div>
    )
}

export default ReqResPassword;