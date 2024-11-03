const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');
const path = require('path');
const fs = require('fs');

const register = async (req, res) => {
    let params = req.body;

    if (!params.name || !params.lastname || !params.documento || !params.phone || !params.username || !params.password || !params.gender) {
        return res.json({
            error: true,
            msg: "You must complete all inputs"
        });
    }

    params.name = params.name.toLowerCase();
    params.lastname = params.lastname.toLowerCase();
    params.gender = params.gender.toLowerCase();

    try {
        const existUser = await User.find({
            $or: [
                { documento: params.documento }
            ]
        }).exec();

        if (existUser && existUser.length >= 1) {
            return res.json({
                error: true,
                msg: 'User already exists'
            });
        }

        const encryptPass = await bcrypt.hash(params.password, 10);
        params.password = encryptPass;

        try {
            const newUser = new User(params);
            newUser.save();
            return res.json({
                error: null,
                msg: 'User saved successfully',
                newUser
            });
        } catch (error) {
            return res.json({
                error: true,
                msg: 'Error saving user'
            })
        }

    } catch (error) {
        return res.json({
            msg: 'Error while saving user',
            error
        });
    }
}

const login = async (req, res) => {
    const params = req.body;
    if (!params.username || !params.password) {
        return res.status(400).json({
            status: '400',
            message: 'Usuario y/o contraseña incorrectos'
        });
    }

    try {
        const user = await User.findOne({ username: params.username });
        //console.log(user);

        if (!user) {
            return res.status(400).json({
                status: '400',
                msg: 'Usuario y/o contraseña incorrectos'
            });
        }

        const pwd = bcrypt.compareSync(params.password, user.password);

        if (!pwd) {
            return res.status(400).json({
                status: "Error 400",
                message: "Usuario y/o contraseña incorrectos"
            });
        }

        const token = jwt.createToken(user);

        return res.status(200).json({
            status: 200,
            msg: 'Sesión iniciada correctamente',
            token,
            user
        });

    } catch (error) {
        return res.json({
            status: 400,
            msg: 'Oops sorry some is wrong',
            error: error.message,
            stack: error.stack
        });
    }
}

const dashboard = async (req, res) => {
    const serverUrl = req.protocol + '://' + req.get('host');
    return res.status(200).json({
        status: 200,
        user: req.user,
        serverUrl
    });
}

const getUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const serverUrl = req.protocol + '://' + req.get('host');

        const user = await User.findById(userId).select('-password -__v');
        if (!user) {
            res.status(404).json({ error: true, msg: 'No se encontrado el usuario' });
        }

        res.json({ error: null, user, serverUrl });
    } catch (error) {
        console.log(error);
    }
}

const uploadProfile = async (req, res) => {

    if (!req.file) {
        return res.status(404).send({
            status: 'error',
            msg: 'No se ha seleccionado una imagen'
        });
    }

    const ext = path.extname(req.file.originalname);

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.gif' && ext !== '.webp') {
        console.log('archivo ' + ext + ' no valido');
        const filePath = req.file.path;
        fs.unlinkSync(filePath);
        return res.status(400).send({
            status: 'Error',
            msg: 'El archivo seleccionado no es valido'
        });
    }

    try {

        const serverUrl = req.protocol + '://' + req.get('host');
        const userUpdate = await User.findOneAndUpdate(
            { _id: req.user.id },
            { image: req.file.path },
            { new: true }

        ).select('-__v -password -_id');

        if (!userUpdate) {
            return res.status(404).send({
                status: 'error',
                msg: 'Usuario no encontrado'
            });
        }
        req.user.profile = userUpdate.image
        res.status(200).send({
            status: 'success',
            user: userUpdate,
            msg: 'La foto de perfil se cambio exitosamente',
            serverUrl,
            profile: req.user.profile
            //file: req.file,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'error',
            msg: 'Ocurrió un error al actualizar la imagen de perfil'
        });
    }
}


const sendTrans = (req, res) => {
    return res.json({
        form: `<form class="form-send-transf">
            <fieldset>
            <legend>Datos del banco</legend>
            <div>
                <label for="banco">Banco:<span>*</sapn></label>
                <input type="text" name="bankEntity" id="banco" placeholder="Entidad Bancaria" oninput="soloLetrasYEspacios(this);" required>
                <label for="tipo">Tipo Cuenta:</label>
                <select name="accountType" id="tipo">
                    <option value="Ahorro">Ahorro</option>
                    <option value="Corriente">Corriente</option>
                    <option value="Pago Movil">Pago Movil</option>
                </select>
            </div>
            <div>
                <label for="cuenta">N° Cuenta:<span>*</sapn></label>
                <input type="text" name="account" id="cuenta" placeholder="Numero de cuenta" oninput="formatAccount(this);" required>
            </div>
            </fieldset>
            <fieldset>
            <legend>Datos del cliente</legend>
            <div class="cliente-sending">
                <div>
                    <label for="nombre">Nombre Completo:</label>
                    <input type="text" name="nameClient" id="nombre" placeholder="Nombre del cliente" oninput="soloLetrasYEspacios(this);">
                </div>
                <div>
                    <label for="doqument">N° Documento:<span>*</sapn></label>
                    <input type="text" name="documentClient" id="doqument" placeholder="N° de Documento" oninput="separardorMiles(this);" required>
                </div>
            </div>
            </fieldset>
            <fieldset>
                <legend>Valor</legend>
                <div>
                    <label for="valor">Valor B$<span>*</span></label>
                    <input type="text" name="cashBs" id="valor" placeholder="Valor en soberanos" oninput="separardorMiles(this);" required>
                </div>
            </fieldset>
            <button type="submit" id="btn-send">Enviar e imprimir</button>
        </form>`
    });
}

const getTransfers = (req, res) => {
    res.json({
        form: `
            <div class="data-transfers">
                <form class="form-search">
                    <h2>Consulta de trasferencias</h2>
                    <p>Seleccione tipo de consulta</p>
                    <div class="mode-consult">
                        <select name="consult" id="consult">
                            <option value="fact">Referencia</option>
                            <option value="dni">Documento </option>
                        </select>
                        <input type="text" name="searching" id="searching" oninput="soloNumeros(this)">
                        <div class="date-search">
                            <label for="date">Por fecha:</label>
                            <input type="date" name="date" id="date" />
                        </div>
                    </div>
                    <button type="submit" id="btn-search">Buscar</button>
                </form>
                <div class="data-transfers-get"></div>
            </div>
        `});
}

const changePassword = async (req, res) => {
    const params = req.body;

    if (!params.oldPass || !params.newPass || !params.confirNewPass) {
        return res.json({ error: true, msg: 'Los campos del formulario son obligatorios' });
    }

    if (params.newPass !== params.confirNewPass) {
        return res.json({ error: true, msg: 'Las claves no coinciden' });
    }
    try {
        const userToChangePass = await User.findById({ _id: req.user.id });

        if (!userToChangePass) {
            return res.json({ error: true, msg: 'Se ha generado un error al intentar cambiar la clave, intente mas tarde' });
        }

        const isMatch = bcrypt.compareSync(params.oldPass, userToChangePass.password);

        if (!isMatch) {
            return res.json({ error: true, msg: 'La clave actual es incorrecta' });
        }

        const encryptNewPass = await bcrypt.hash(params.newPass, 10);
        userToChangePass.password = encryptNewPass;

        await userToChangePass.save();
        res.json({ error: null, msg: 'La clave se ha cambiado exitosamente' });

    } catch (error) {
        console.log(error);

    }
}

module.exports = {
    register,
    login,
    dashboard,
    sendTrans,
    getTransfers,
    changePassword,
    getUser,
    uploadProfile
}