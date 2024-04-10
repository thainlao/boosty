import { Router } from 'express';
import dotenv from 'dotenv';
import { checkAuth } from '../middleware/checkisAuth.js';
import { changeSubDescription, createAdditionalSub, createSub, getAllAdditionalSubs, getAllSubsData, getSubData, isSubnameAvalible, subscribeToSub, unsubscribeFromSub, uploadSubAvatar, uploadSubBackground } from '../controllers/subController.js';

dotenv.config();

const router = Router();

//созданий страницы
router.post('/createsub', checkAuth, createSub);
router.post(`/createlinkedsub/:subname`, checkAuth, createAdditionalSub);

//получение данных о таблице
router.get('/getsubdata/:subname', getSubData);
router.get('/getallsubsdata', getAllSubsData);
router.get(`/getpresubdata/:subname`, getAllAdditionalSubs)

//проверка доступности названия
router.post('/isnameavalible', isSubnameAvalible);

//загрузка аватара и background
router.post(`/uploadsubavatar/:subname`, uploadSubAvatar);
router.post(`/uploadsubbackground/:subname`, uploadSubBackground)

//crud
router.post(`/changesubdescription/:subname`, checkAuth, changeSubDescription);

//subscribe to sub
router.post(`/subscribetosub/:subname`, checkAuth, subscribeToSub);
router.post(`/unsubscribetosub/:subname`, checkAuth, unsubscribeFromSub);
export default router;