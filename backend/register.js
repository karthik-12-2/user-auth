const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');
const UserModel = require('./models/UserModel');
const crypto = require('crypto')
require('dotenv').config();

router.post('/', async (req, res) => {
    const detail = req.body;
    try {
        await UserModel.create(detail);
        res.send('Success');
        // otp generation
        if(detail.Email !== "") {
            const mail = detail.Email;
            function generate() {
                const otp = crypto.randomInt(1000, 9999).toString();
                const otpExpiration = Date.now() + 60 * 1000;
                return {otp, otpExpiration}    
            }
            
            const {otp, otpExpiration} = generate();
            let isExpired = false;
            function inputOtp(otpExpiration ) {
                const currentTime = Date.now()
                if(currentTime > otpExpiration){
                    isExpired = true;
                    return "Otp Expired";
                }
                return "Valid";
            }
            
            const transporter = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
            
            async function main() {
                console.log('mail has been sent.', otp);
                try{
                    await UserModel.updateOne({Email: mail}, {$set:{Otp: otp, ExpiredOtp: isExpired}});
                } catch(err){
                    console.log(err);
                }
                const info = await transporter.sendMail({
                    from: "noreply : noreply@gmail.com",
                    to: mail,
                    subject: "OTP Verification",
                    text: `${otp}\n\n--\nThis is an automated email. Please do not reply.`,
                })
                console.log("message sent: %s", info.messageId);
            }
            (async () => {
                try {
                    await main();
                    console.log("Main function completed.");
                } catch (error) {
                    console.error("Error occurred:", error);
                }
            })();

            setTimeout( async () => {
                const result = inputOtp(otpExpiration);
                if(result === "Otp Expired"){
                    isExpired = true;
                    await UserModel.updateOne({Email: mail}, {$set:{ExpiredOtp: isExpired}});
                    console.log("Otp Expired",otp)
                }
            }, 70000)   
        }
    }catch(err) {
        res.send('Email already exists');
    }
})

module.exports = router