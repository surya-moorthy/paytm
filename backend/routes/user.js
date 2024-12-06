const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_PASSWORD } = require('../config');
const UserRouter = express.Router()
const z = require('zod');
const { User, Account } = require('../db/db');
const bcrypt = require('bcrypt');
const authmiddleware = require('./middleware');

const SignupBody = z.object({
    username : z.string().email(),
    password : z.string().min(8),
    firstname : z.string(),
    lastname : z.string().optional()
})

UserRouter.post('/Signup',async (req,res)=>{

    const {success} = SignupBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg : "Invalid Inputs"
        })
    }

    const finduser = await User.findOne({
            username : req.body.username
    })
    if(finduser){
        return res.status(411).json({
            msg : " Email or username is already present"
        })
    }

   const user=  await User.create({
        username : req.body.username,
        password : req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    })

//6751884afb3d1e8a3032beb3

    const createUser = await Account.create({
        UserId: user._id,
        balance:  1 + Math.random()*10000
    })
    console.log(Math.random())
    
    const userId = user._id
    const password = req.body.password
       const token = jwt.sign(password,JWT_PASSWORD);
       res.json({
        msg : "User created successfully",
        userId : userId,
        token : token  , 
       
       })
})
const SinginBody = z.object({
    username : z.string().email(),
    password : z.string().min(8)
})
UserRouter.post('/Signin',(req,res)=>{
    const {success} = SinginBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
             msg: "Invalid inputs"
        })
    }
    const user = req.body.username;
    const password = req.body.password;
    const finduser = User.findOne({
        username : user
    })
    if(finduser){
        const token = jwt.sign(password,JWT_PASSWORD);
        res.status(200).json({
            userID : finduser._id,
            token : token
            
        })
        return
    }
    res.status.json({
        msg : " Error while logging in"
    })
})
const UpdateBody = z.object({
    password : z.string().min(8).optional(),
    firstname : z.string().optional(),
    lastname  : z.string().optional(),
})
UserRouter.put('/',authmiddleware,async (req,res)=>{
    const { success} = UpdateBody.safeParse(req.body)
    if(!success){
        res.status(411).json({
            msg : "Invalid Inputs/Error while updating information"
        })
    }
    await User.updateOne({_id:req.userId},req.body);

    res.json({
        msg : "Updated successfully"
    })

})

UserRouter.get('/bulk',authmiddleware,(req,res)=>{
     const username = req.query.filter;
     const findUser = User.find({
        $or : [
            {firstname:{
                $regex:username
            }}
        ], function(err,docs){
            if(!err){
                return docs;
            }
        }

     })
    res.status(200).json({
            user : [
                {
                    firstname : findUser.firstname,
                    lastname : findUser.lastname,
                    _id : findUser._id,

                }

            ]

    })
     
})


module.exports = UserRouter