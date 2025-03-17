const nodeMailer = require('nodemailer');
const UserModel = require('./models/UserModel');
require('dotenv').config();

const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
  }
})

const Email = async (email) => {
  if(email !== null){
    try {
      const data = await UserModel.findOne({Email: email});
      let resetToken;

      if(data) {
        resetToken = data.resetToken;
        if(!resetToken) {
          const newToken = Math.random().toString(36).substring(2);
          try {
            await UserModel.findOneAndUpdate({Email: email}, {$set: {resetToken: newToken}});
            const updatedData = await UserModel.findOne({Email: email});
            resetToken = updatedData.resetToken;
          } catch(err){
            console.error("Error updating resetToken: ", err);
            // return 'failed';
          }
        } else {
          console.error("User not found: ");
        }
      }

      const sendMail = await transporter.sendMail({
        from: "noreply : noreply@gmail.com",
        to: email,
        subject: "Reset password link",
        html: '<p>click <a href="http://localhost:3000/resetpassword/'+ resetToken +'"> here </a> to reset your password</p>' ,
        text: `\n\n--\nThis is an automated email. Please do not reply.`,
      })
      
      console.log('Mail sent successfully:', sendMail.messageId);
      return {token: resetToken};
    }catch (err) {
      console.error('Error occurred:', err);
    }
  }
}

module.exports = {Email}