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

const getTransfers = async (req, res) => {
    let params = req.body;

    // Validar que al menos uno de los parámetros esté presente
    if (!params.search && !params.date) {
        return res.json({
            error: true,
            msg: 'Los parámetros de búsqueda han generado un error'
        });
    }

    // Construcción de la consulta
    let query = {};
    query.user = req.user.id;
    // Agregar búsqueda por fecha si está presente
    if (params.date) {
        let [year, month, day] = params.date.split('-');

        day = parseInt(day, 10).toString();

        params.date = `${day}/${month}/${year}`;
        query.created_at = { $regex: `^${params.date}` };
    }

    // Agregar búsqueda por referencia si está presente
    if (params.search) {
        if (params.ref === 'fact') {
            query.fact = params.search;
        } else if (params.ref === 'dni') {
            query.documentClient = params.search;
        }
    }

    try {
        // Ejecutar la búsqueda en la base de datos con la consulta construida
        const transfersGet = await TransferSend.find(query);
        //console.log(transfersGet);

        if (transfersGet.length === 0) {
            return res.json({ error: true, msg: 'No se encontraron transferencias con los parámetros proporcionados.' });
        }

        return res.json({ error: false, data: transfersGet });
    } catch (error) {
        console.log(error);
        return res.json({ error: true, msg: 'Ocurrió un error al buscar las transferencias.' });
    }
}

const updateTransfer = (req, res) => {
    res.json({
        form: `<div class="data-transfers">
                <form class="form-update">
                    <h2>Actualizar transferencia</h2>
                    <div class="mode-consult">
                        <label for="referencia">Referencia</label>
                        <input type="text" name="updReference" id="upd-reference" oninput="soloNumeros(this)">
                        <button type="submit" id="btn-update">Buscar</button>
                    </div>
                </form>
                <div class="data-transfers-get"></div>
            </div>`
    });
}

const updateTransferPost = async (req, res) => {
    const params = req.body
    if (!params.fact) {
        return res.json({ error: true, msg: 'No se ingreso una referencia' })
    }
    try {
        const transfer = await TransferSend.findOne({ fact: params.fact, user: req.user.id });
        res.json({ error: null, data: transfer });
    } catch (error) {
        console.error(error);
    }
}

const updateTransferPut = async (req, res) => {
    const transfUpdate = req.params.id;
    const dataUpdate = req.body;
    dataUpdate.account = dataUpdate.account.replace(/-/g, '');
    dataUpdate.documentClient = helperFunctions.convertirSinSeparador(dataUpdate.documentClient);
    dataUpdate.bankEntity = dataUpdate.bankEntity.toLowerCase();
    dataUpdate.nameClient = dataUpdate.nameClient.toLowerCase();
    dataUpdate.note = dataUpdate.note.toLowerCase();



    try {

        const validateUpdate = await TransferSend.findById(transfUpdate);

        if (!validateUpdate) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }

        if (validateUpdate.status === 'anulada') {
            return res.json({ error: true, message: 'Esta transacción se encuentra anulada no permite modificaciones' });
        }

        const transferUpdate = await TransferSend.findByIdAndUpdate(transfUpdate, dataUpdate, { new: true, runValidators: true });

        if (!transferUpdate) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }
        const detailUpdate = await TransferSend.findById(transferUpdate._id).populate({
            path: 'user',
            select: 'documento'
        });

        res.json({ error: null, msg: 'Datos actualizados', detailUpdate });

    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
}

const cancelTransfer = (req, res) => {
    res.json({
        form: `<div class="data-transfers">
        <form class="form-cancel">
            <h2>Anular transferencia</h2>
            <div class="mode-consult">
                <label for="referencia">Referencia</label>
                <input type="text" name="cancelReference" id="cancel-reference" oninput="soloNumeros(this)">
                <button type="submit" id="btn-search-cancel">Buscar</button>
            </div>
        </form>
        <div class="data-transfers-get"></div>
    </div>`
    });
}

const getTransfersToAnular = async (req, res) => {
    let params = req.body;

    try {
        // Ejecutar la búsqueda en la base de datos con la consulta construida
        const transfersGet = await TransferSend.findOne({ fact: params.ref, user: req.user.id });

        if (!transfersGet) {
            return res.json({ error: true, msg: 'No se encontró ningún dato con la referencia: ' + params.ref });
        }

        return res.json({ error: false, data: transfersGet });
    } catch (error) {
        console.log(error);
        return res.json({ error: true, msg: 'Ocurrió un error al buscar las transferencias.' });
    }
}

const nullTransfPut = async (req, res) => {
    const params = req.body;
    //console.log(params);
    params.note = 'anulada';
    params.status = 'anulada';

    try {

        const validateAbort = await TransferSend.findById(params.idToNull);

        if (!validateAbort) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }

        if (validateAbort.status === 'anulada') {
            return res.json({ error: true, message: 'Esta transacción ya se encuentra anulada' });
        }

        const transferGetNull = await TransferSend.findByIdAndUpdate(
            { _id: params.idToNull, user: req.user.id },
            { note: params.note, status: params.status },
            { new: true, runValidators: true }
        );

        if (!transferGetNull) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }
        const detailToNull = await TransferSend.findById(transferGetNull._id).populate({
            path: 'user',
            select: 'documento'
        });

        res.json({ error: null, msg: 'Transacción anulada', detailToNull });

    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
}

const getTransfersReport = async (req, res) => {
    const fechaHoy = new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' });

    const enviadas = [];
    const anuladas = [];
    const valorPesosEnv = [];

    try {

        const transactions = await TransferSend.find({ user: req.user.id, created_at: { $regex: `^${fechaHoy}` } });

        transactions.forEach(transaction => {

            if (transaction.status === 'anulada') {
                anuladas.push(transaction);
            } else {
                valorPesosEnv.push((transaction.cashBs / 0.01).toFixed(0));
                enviadas.push(transaction);
                //valorBolivares.value = (valorPesos.value / 0.009).toFixed(0);
            }
        });

        res.json({ enviadas, anuladas, valorPesosEnv });

    } catch (error) {
        console.log(error);
    }
}




module.exports = {
    sendTransfer,
    getTransfers,
    updateTransfer,
    updateTransferPost,
    updateTransferPut,
    cancelTransfer,
    getTransfersToAnular,
    nullTransfPut,
    getTransfersReport
}
