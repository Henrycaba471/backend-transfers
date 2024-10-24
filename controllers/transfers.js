const TransferSend = require('../models/TransferSend');

const sendTransfer = async (req, res) => {
    let params = req.body

    if (!params.bankEntity || !params.account || !params.documentClient || !params.cashBs) {
        return res.json({
            error: true,
            msg: 'Los campos con * son obligatorios'
        });
    }

    params.bankEntity = params.bankEntity.toLowerCase();
    params.nameClient = params.nameClient.toLowerCase();
    params.accountType = params.accountType.toLowerCase();
    params.user = req.user.id;

    try {
        const newSend = new TransferSend(params);
        newSend.save();
        return res.json({
            error: null,
            msg: 'Transacción exitosa',
            newSend
        });

    } catch (error) {
        return res.json({
            error: true,
            msg: 'Transacción no exitosa se ha generado un error'
        });
    }
}


module.exports = {
    sendTransfer
}