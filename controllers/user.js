const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');

const register = async (req, res) => {
    let params = req.body;
    params.name = params.name.toLowerCase();
    params.lastname = params.lastname.toLowerCase();

    if (!params.name || !params.lastname || !params.phone || !params.username || !params.password) {
        return res.json({
            error: true,
            msg: "You must complete all inputs"
        });
    }

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
            error
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
                <input type="text" name="banco" id="banco" placeholder="Entidad Bancaria">
                <label for="tipo">Tipo Cuenta:</label>
                <select name="tipo" id="tipo">
                <option value="Ahorro">Ahorro</option>
                <option value="Corriente">Corriente</option>
                <option value="Pago Movil">Pago Movil</option>
                </select>
            </div>
            <div>
                <label for="cuenta">N° Cuenta:<span>*</sapn></label>
                <input type="text" name="cuenta" id="cuenta" placeholder="Numero de cuenta">
            </div>
            </fieldset>
            <fieldset>
            <legend>Datos del cliente</legend>
            <div>
                <label for="nombre">Nombre Completo:</label>
                <input type="text" name="nombre" id="nombre" placeholder="Nombre del cliente">
                <label for="doqument">N° Documento:<span>*</sapn></label>
                <input type="text" name="doqument" id="doqument" placeholder="N° de Documento">
            </div>
            </fieldset>
            <fieldset>
                <legend>Valor</legend>
                <label for="valor">Valor B$<span>*</span></label>
                <input type="text" name="valor" id="valor" placeholder="Valor en soberanos">
            </fieldset>
            <button>Enviar e imprimir</button>
        </form>`
    });
}


module.exports = {
    register,
    login,
    dashboard,
    sendTrans
}