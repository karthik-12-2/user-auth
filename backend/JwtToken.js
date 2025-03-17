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

// const token = generateToken('677d57d7cfe21fdb70cfdeb6', 'karthik@gmail.com');
// console.log(token)
// const verifiedToken = verifyToken('dfasdfadfas');
// if (verifiedToken) {
//     console.log('Verified Token:', verifiedToken);
//     // console.log('Email Matches:', verifiedToken.Email === 'noting@gmail.com');
// } else {
//     console.log('Token verification failed.');
// }

module.exports = { generateToken, verifyToken }