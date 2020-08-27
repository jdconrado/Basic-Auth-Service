const express = require('express');
const joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usersCtrl = require('../db/users');
const { json } = require('express');

const auth = express.Router();

const userSchema = joi.object({
    name: joi.string().trim(),
    lastname: joi.string().trim(),
    email: joi.string().trim().email().required(),
    password:joi.string().min(8).max(30).required()
});

auth.post('/signup',async (req, res, next)=>{
    let validation = userSchema.validate(req.body);
    if(validation.error){
        return next(Error(validation.error));
    }
    let user  = await usersCtrl.getUserByMail(validation.value.email);
    if (user){
        res.status(422);
        return next(Error('This email has already been taken.'));
    }
    bcrypt.hash(validation.value.password, 10)
        .then((hash)=>{
            validation.value.password = hash;
            usersCtrl.createUser(validation.value)
                .then((id)=>{
                    return res.json({
                        result: "success",
                        user_id: id
                    });
                }).catch((error)=>{
                    res.status(500);
                    return next(error);
                });
        }).catch((error)=>{
            res.status(500);
            return next(error);
        });
});

auth.post('/login', async (req, res, next)=>{
    let validation = userSchema.validate(req.body);
    if(validation.error){
        return next(Error(validation.error));
    }
    let user  = await usersCtrl.getUserByMail(validation.value.email);
    if (!user){
        res.status(422);
        return next(Error('Email and/or password are incorrect.'));
    }
    bcrypt.compare(validation.value.password, user.password)
        .then((result)=>{
            if(!result){
                res.status(422);
                return next(Error('Email and/or password are incorrect.'));
            }else{
                const payload = {
                    uid : user.id,
                    email : user.email
                }
                jwt.sign(payload, process.env.JSON_SECRET,{
                    expiresIn: '2h'
                }, (error, token)=>{
                    if(error){
                        res.status(500);
                        return next(error);
                    }
                    res.cookie('ujtk',token, {
                        signed: true,
                        httpOnly: true,
                        maxAge: 2*3600000,
                        secure: process.env.ENV === 'PRODUCTION'
                    });

                    return res.json({
                        result:"success"
                    });
                });
            }
        }).catch((error)=>{
            res.status(500);
            return next(error);
        });
});

module.exports = auth;