const express = require('express');
const usersCtrl = require('../db/users');

const user = express.Router();

user.get('/info', async (req, res, next)=>{
    if(req.user){
        const user = await usersCtrl.getUserById(req.user.uid)
        if(!user){
            return next(Error('User not found.'));
        }
        return res.json(user);
    }
    return next(Error('Not logged in.'))
});

module.exports = user;