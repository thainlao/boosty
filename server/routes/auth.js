import { Router } from 'express';
import dotenv from 'dotenv';
import { activateAccount, deleteUser, getMe, loginUser, registerUser, requestPasswordReset, resetPassword, updateEmail, updateUsername, uploadAvatar } from '../controllers/authController.js';
import { checkAuth } from '../middleware/checkisAuth.js';

dotenv.config();

const router = Router();

//login User
router.post('/login', loginUser)

//register User
router.post('/signup', registerUser)

//getme
router.get('/me', checkAuth, getMe)

//upload avatar
router.post('/uploadavatar', checkAuth, uploadAvatar);

//crud
router.post('/changeemail', checkAuth, updateEmail);
router.post('/changeusername', checkAuth, updateUsername);
router.post('/deleteuser', checkAuth, deleteUser);

//activate, resetPassword
router.get('/activate/:link', activateAccount);
router.post("/requestreset", requestPasswordReset);
router.post("/resetpassword", resetPassword);

export default router;