const express = require('express');
const router = express.Router();
const sendController = require('../controllers/transfers');
const sendAuthentication = require('../middlewares/aurh');

router.post('/send-transfer', sendAuthentication.checkAuth, sendController.sendTransfer);
router.post('/ver-transfers', sendAuthentication.checkAuth, sendController.getTransfers);
router.get('/update-transfer', sendAuthentication.checkAuth, sendController.updateTransfer);
router.get('/cancel-transfer', sendAuthentication.checkAuth, sendController.cancelTransfer);
router.post('/update', sendAuthentication.checkAuth, sendController.updateTransferPost);
router.post('/anular-transfer', sendAuthentication.checkAuth, sendController.getTransfersToAnular);
router.put('/update-transf/:id', sendAuthentication.checkAuth, sendController.updateTransferPut);
router.put('/abort-transf', sendAuthentication.checkAuth, sendController.nullTransfPut);
router.get('/reportes', sendAuthentication.checkAuth, sendController.getTransfersReport);


module.exports = router;