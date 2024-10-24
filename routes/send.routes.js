const express = require('express');
const router = express.Router();
const sendController = require('../controllers/transfers');
const sendAuthentication = require('../middlewares/aurh');

router.post('/send-transfer', sendAuthentication.checkAuth, sendController.sendTransfer);

module.exports = router;