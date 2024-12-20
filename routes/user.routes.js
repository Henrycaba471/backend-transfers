const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/user');
const authentication = require('../middlewares/aurh');
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/profiles');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, 'profile-' + req.user.username + ext);
    }
});

const uploads = multer({ storage });

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/change-password', authentication.checkAuth, userController.changePassword);
router.post('/upload-profile', [authentication.checkAuth, uploads.single('profile')], userController.uploadProfile);
router.post('/reset-password', userController.resetPassword);
router.put('/reset-password-user', userController.createNewPassword);
router.get('/dashboard', authentication.checkAuth, userController.dashboard);
router.get('/user', authentication.checkAuth, userController.getUser);
router.get('/send-transf', authentication.checkAuth, userController.sendTrans);
router.get('/search-transfers', authentication.checkAuth, userController.getTransfers);
router.get('/forgot-password', userController.forgotPasswordForm),
router.get('/support-contact', authentication.checkAuth, userController.supportContact);


module.exports = router;