const express = require('express');
const UserModel = require('./models/UserModel');
const router = express.Router();

router.post('/', async(req, res) => {
    const { Email , Password } = req.body;
    if(Email !== null, Password !== null){
        const isUser = await UserModel.findOne({Email: Email, Password: Password})
        if(isUser === null){
            res.send('Your account does not exist');
        } else if( isUser !== null) {
            res.send('Success');
        } else {
            res.send('failed')
        }
    } else {
        res.send('failed')
    }
});

module.exports = router