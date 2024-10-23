const jwt = require('jwt-simple');
const moment = require('moment');

const secretKey = process.env.SECRET_KEY;

const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        phone: user.phone,
        username: user.username,
        profile: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "minutes").unix()
    }
    return jwt.encode(payload, secretKey);
}

module.exports = {
    createToken,
    secretKey
}