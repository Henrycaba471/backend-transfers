const express = require('express');
const router = express.Router();
const sendController = require('../controllers/transfers');
const sendAuthentication = require('../middlewares/aurh');

router.post('/send-transfer', sendAuthentication.checkAuth, sendController.sendTransfer);
router.post('/ver-transfers', sendAuthentication.checkAuth, sendController.getTransfers);
router.get('/update-transfer', sendAuthentication.checkAuth, sendController.updateTransfer);
router.post('/update', sendAuthentication.checkAuth, sendController.updateTransferPost);
router.put('/update-transf/:id', sendAuthentication.checkAuth, sendController.updateTransferPut);

module.exports = router;