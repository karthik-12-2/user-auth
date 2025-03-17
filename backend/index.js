const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { generateToken, verifyToken } = require('./JwtToken');
const registerRouter = require('./register');
const verifyRouter = require('./verifyOtp');
const resendRouter = require('./resendOtp');
const UserModel = require('./models/UserModel');
const loginRouter = require('./login');
const {Email} = require('./Email');
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/users');

app.use('/api/auth/register', registerRouter);

app.use('/api/auth/verify-otp', verifyRouter );

app.use('/api/auth/resend-otp', resendRouter);

app.post('/api/auth/token', async (req, res) => {
    const mail = req.body.mail;
    try {
        const response = await UserModel.findOne({Email: mail})
        res.send(response.JWTToken);
    } catch(err) {
        console.log("token not found");
    }
});

app.use('/api/auth/login', loginRouter);

app.post('/api/auth/token-verify', async(req, res) => {
    const {token} = req.body
    if(token !== null){
        res.send('Success')
    } else {
        res.send('failed')
    }
    // res.send('Token not available')
})

app.post('/api/auth/generate-token', async (req, res) => {
    const {Email} = req.body
    if(Email !== null) {
        const id = await UserModel.findOne({Email: Email})
        if(id !== null){
            const token = generateToken(id._id, Email)
            const setToken = await UserModel.updateOne({Email: Email}, {$set: {JWTToken: token}})
            res.send(token)
        }
    } else{

    }
})


app.post('/api/auth/is-token', async (req, res) => {
    const {token} = req.body
    if(token !== null){
        const vToken = verifyToken(token);
        if(vToken !== null ){
            const checkToken = await UserModel.findOne({_id: vToken.id, Email: vToken.Email})
            if(checkToken.JWTToken === token){
                res.send('Verified');
            } 
        } else if(vToken === null){
            res.send('Verification Failed');
        }
    } 
})

app.post('/api/auth/get-user', async (req, res) => {
    const {token} = req.body;
    if(token){ 
        try {
            const { FullName , Email} = await UserModel.findOne({JWTToken: token}).select('FullName Email');
            res.json({FullName: FullName, Email: Email})
        }catch(err){
            res.send('Error')
        }
    }
})

app.post('/api/auth/forget-password', async(req, res) => {
    const {email} = req.body;
    try {
        const response = await Email(email);
        res.send({message: "Password reset link sent", resetToken: response.token});
    } catch(err) {
        res.send('Error');
    }

})

app.post('/api/auth/verify-reset-token', async(req, res) => {
    const {token} = req.body;
    if(token) {
        try {
            const response = await UserModel.findOne({resetToken: token})
            if(response) {
                res.send('Success');
            } else {
                res.send('Error');
            }
        }catch (err) {
            res.send("Error")
        }
    }
})

app.post('/api/auth/reset-password', async(req, res) => {
    const { password, resetToken } = req.body;
    try {
        await UserModel.findOneAndUpdate({resetToken: resetToken}, {$set: {Password: password}})
        res.send('Successfully Changed')
    } catch(err) {
        console.log('err')
    }
})

app.listen('4000', () => {console.log('server running at 4000 port')});