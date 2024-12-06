const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_PASSWORD } = require('../config');
const authmiddleware = (req,res,next) =>{
    const header = req.headers.authorization;
    if(!header || !header.startsWith('Bearer ')){
        res.status(411).json({})
    }
 
    const token = header.split(' ')[1]
    console.log(header)
    console.log(typeof token)
    console.log(token)
    try {
        const verifytoken = jwt.verify(token,JWT_PASSWORD);
        console.log(verifytoken);
        req.userId = verifytoken.user;    
        next()
    }catch(e){
        res.status(403).json({
            msg : e
        })
    }

}

module.exports = authmiddleware;