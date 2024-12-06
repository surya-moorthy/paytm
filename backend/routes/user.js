const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_PASSWORD } = require('../config');
const UserRouter = express.Router()
const z = require('zod');
const bcrypt = require('bcrypt');
const authmiddleware = require('./middleware');
const { prisma } = require('./prisma');


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

    const finduser = await prisma.user.findUnique({
            where : {
                username : req.body.username
            }
    })
    if(finduser){
        return res.status(411).json({
            msg : " Email or username is already present"
        })
    }

   const user=  await prisma.user.create({
    data : {username : req.body.username,
    password : req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname}
    })

//6751884afb3d1e8a3032beb3

    const createAccount = await prisma.account.create({
        data : {UserId: user.id,
        balance:  1 + Math.random()*10000}
    })
    console.log(Math.random())
    
    const userId = user.id
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
    const finduser = prisma.user.findUnique({
        where : {
            username : user
        }
    })
    if(finduser){
        const token = jwt.sign(password,JWT_PASSWORD);
        res.status(200).json({
            userID : finduser.id,
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
    await prisma.user.updateMany({
        where : {
            id : req.userId,
        },
        data : {
            ...req.body
        }
    })

    res.json({
        msg : "Updated successfully"
    })

})

UserRouter.get('/bulk',authmiddleware,async (req,res)=>{
     const username = req.query.filter;
     try {
        const findUser = await prisma.user.findMany({
            where : {
                firstname : {
                    contains: username
                }
            },
            select : {
                id : true,
                username: true,
                password : true,
                firstname: true,
                lastname: true,
                Account : true
            }
    
         })
         console.log(findUser)
        res.status(200).json({
                user : findUser.map((user)=>({
                    username : user.username,
                    password : user.password,
                    firstname : user.firstname,
                    lastname : user.lastname,
                    id : user.id
                })),
    
        });
         
     }catch(e) {
        res.status(411).json({
            msg : " can't able to get user"
        })
     }
})


module.exports = UserRouter