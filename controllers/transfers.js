const TransferSend = require('../models/TransferSend');
const helperFunctions = require('../helpers/functions');

const sendTransfer = async (req, res) => {
    let params = req.body
    //console.log(params);

    params.account = params.account.replace(/-/g, '');
    params.documentClient = helperFunctions.convertirSinSeparador(params.documentClient);
    params.cashBs = helperFunctions.convertirSinSeparador(params.cashBs);
    //params.created_at = new Date();
    //console.log(params);

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
        await newSend.save();
        //console.log(newSend);

        const detailSend = await TransferSend.findById(newSend._id).populate({
            path: 'user',
            select: 'username documento phone'
        });

        //console.log(detailSend);

        return res.json({
            error: null,
            msg: 'Transacción exitosa',
            detailSend
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