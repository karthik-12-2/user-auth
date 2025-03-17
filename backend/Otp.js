const nodeMailer = require('nodemailer');
const UserModel = require('./models/UserModel');
const crypto = require('crypto');

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
    return "Valid"
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


async function main(mail) {
    console.log("Otp send",otp);
    if (!mail) {
        throw new Error("Recipient email is not defined.");
    }
    await UserModel.findOneAndUpdate({Email: mail}, {$set:{ExpiredOtp: "false", Otp: otp}});
    const info = await transporter.sendMail({
        from: "noreply : noreply@gmail.com",
        to: mail,
        subject: "OTP Verification",
        text: `${otp}\n\n--\nThis is an automated email. Please do not reply.`,
    })
    console.log("message sent: %s", info.messageId);
}

const mail = async(email) => {
    try {
        await main(email);
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

setTimeout( async () => {
    const result = inputOtp(otpExpiration);
    if(result === "Otp Expired"){
        isExpired = true;
        await UserModel.updateOne({Email: mail}, {$set:{ExpiredOtp: isExpired}});
        console.log("Otp Expired",otp)
    }
}, 70000)   

module.exports = { mail }