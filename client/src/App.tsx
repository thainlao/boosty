import Header from "./components/Header";
import Mainbody from "./components/Mainbody"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppDispatch } from "./store/hoocs";
import { useEffect } from "react";
import { getMe } from "./store/reducers/authSlice";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Settings from "./components/Settings";
import SubDashboard from "./components/SubDashboard";
import ActivationLink from "./components/ActivationLink";
import ResetPassword from "./pages/ResetPassword";
import ReqResPassword from "./pages/ReqResPassword";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMe())
  },[dispatch])

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Mainbody />} />
        <Route path="/settings" element={<Settings />}/>
        <Route path="/:subname" element={<SubDashboard />}/>
        <Route path="/activate/:link" element={<ActivationLink />}/>
        <Route path="/resetpassword" element={<ResetPassword />}/>
        <Route path="/resetpassword/:resetToken" element={<ReqResPassword />}/>
      </Routes>
      <ToastContainer />
    </Router>
  )
}

export default App
