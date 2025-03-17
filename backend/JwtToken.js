const jwt = require('jsonwebtoken');
require('dotenv').config();

if (!process.env.JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY is not defined in .env file');
}

const generateToken = (id, email) => {
    const secretKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ id: id, Email: email }, secretKey, { expiresIn: '5h' });
}

const verifyToken = (token) => {
    try {
        const secretKey = process.env.JWT_SECRET_KEY;
        return jwt.verify(token, secretKey)
    }catch(Err) {
        return null
    }
}


module.exports = { generateToken, verifyToken }