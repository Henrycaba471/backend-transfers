const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authentication = require('../middlewares/aurh')


router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/dashboard', authentication.checkAuth, userController.dashboard);
router.get('/send-transf', authentication.checkAuth, userController.sendTrans);

module.exports = router;