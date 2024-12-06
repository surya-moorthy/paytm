const express = require('express');
const authmiddleware = require('./middleware');
const { z } = require('zod');
const { prisma } = require('./prisma');
const accountRouter =  express.Router();

accountRouter.get('/balance',authmiddleware,async (req,res)=>{
   const account = await prisma.account.findFirst({
       where : {
        id : req.userId
       }
   })
   res.json({
       id : req.userId,
       balance : account.balance
   })

});

//

const transferBody = z.object({
    to : z.string(),
    amount : z.number()
})

accountRouter.post('/transfer',authmiddleware,async (req,res)=>{
    const toAccount = req.body.to;
    const Amount = req.body.amount;
    const findAccount = await prisma.account.findUnique({
        where : {
            UserId : toAccount
        }
    })
    if(!findAccount) {
        res.status(411).json({msg : "there is no such account"})
    }
    console.log(req.userId)
    const findBalance = await prisma.account.findFirst({
        where : {
            UserId : req.userId
        }
    })
    console.log(findBalance.balance )
    if(findBalance.balance < Amount){
        res.json({msg : "unsufficient balance"})
    }
    try {
        await prisma.$transaction(
            prisma.account.update({
                where : {
                    UserId:req.userId
                },
                data : {
                  balance : -Amount
                }
            }),
            prisma.account.update({
                where : {
                    UserId:toAccount
                },
                data : {
                  balance : Amount
                }
            })
        )
        res.json({msg : "transferred successful"})
    }catch(e){
        res.status(411).json({
            msg : e
        })
    }
    // const session = await mongoose.startSession();
    
    // session.startTransaction();
    // const {success} = transferBody.safeParse(req.body);

    // if(!success){
    //     res.json({
    //         msg : "Invalid Inputs"
    //     }).status(411)
    // }
    
    // const findAccount = await prisma.account.findUnique({
    //     UserId : toAccount
    // }).session(session)
    // if(!findAccount){
    //     session.abortTransaction()
    //     res.json({
    //         msg : " Invalid Account"
    //     }).status(400)
    // }
    // const findBalance = Account.findOne({
    //     UserId:req.userId
    // }).session(session)
    // if ( findBalance.balance < Amount ){
    //     session.abortTransaction()
    //    res.json({
    //     msg : "insufficient Balance"
    //    })   
    // }

    // await Account.updateOne({UserId:req.userId},{$inc : {balannce : -Amount}});
    // await Account.updateOne({UserId:toAccount},{$inc : { balance:Amount}});

    // res.json({
    //     msg : "Amount Transferred successfully"
    // }).status(200)
})


module.exports= {
    accountRouter
}