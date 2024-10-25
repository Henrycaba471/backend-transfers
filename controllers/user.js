const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');

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

    return res.status(200).json({
        status: 200,
        user: req.user
    });
}

const sendTrans =  (req, res) => {
    return res.json({
        form:`<form class="form-send-transf">
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


module.exports = {
    register,
    login,
    dashboard,
    sendTrans
}