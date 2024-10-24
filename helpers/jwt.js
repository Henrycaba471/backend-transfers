const jwt = require('jwt-simple');
const moment = require('moment');

const secretKey = process.env.SECRET_KEY;
//console.log('SECRET_KEY:', secretKey); // Agregar este log para depurar

const createToken = (user) => {
    if (!secretKey) {
        throw new Error("SECRET_KEY is not defined"); // Lanzar un error si la clave no está definida
    }

    const payload = {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        phone: user.phone,
        username: user.username,
        profile: user.image,
        gender: user.gender,
        iat: moment().unix(),
        exp: moment().add(30, "minutes").unix()
    };

    return jwt.encode(payload, secretKey);
}

module.exports = {
    createToken,
    secretKey
}