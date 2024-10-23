const jwt = require('jwt-simple');
const moment = require('moment');
const jwtHelper = require('../helpers/jwt');

const checkAuth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    //console.log(token);

    if (!token) {
        return res.status(403).send({
            status: 403,
            message: "Acceso denegado por favor verifique e intente nuevamente"
        });
    }

    try {
        let payload = jwt.decode(token, jwtHelper.secretKey);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                status: 401,
                message: "El token ha expirado",
                error
            });
        }

        req.user = payload;

    } catch (error) {
        return res.status(404).send({
            status: 404,
            message: "Token ivalido",
            error
        });
    }
    next();
}

module.exports = { checkAuth }