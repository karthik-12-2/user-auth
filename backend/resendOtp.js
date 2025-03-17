const { mail } = require('./Otp');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    const { email } = req.body;
    if(email){
        try {
            await mail(email);
        }catch (err){
            console.log('Error')
        }
    }
})

module.exports = router