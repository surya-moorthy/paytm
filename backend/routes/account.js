const express = require('express');
const authmiddleware = require('./middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');
const { z } = require('zod');
const accountRouter =  express.Router();

accountRouter.get('/balance',authmiddleware,async (req,res)=>{
   const account = await Account.findOne({
    userId : req.userId
   })
   res.json({
    balance : account.balance
   })

});

//

const transferBody = z.object({
    to : z.string(),
    amount : z.number()
})

accountRouter.post('/transfer',authmiddleware,async (req,res)=>{
    const session = await mongoose.startSession();
    
    session.startTransaction();
    const {success} = transferBody.safeParse(req.body);

    if(!success){
        res.json({
            msg : "Invalid Inputs"
        }).status(411)
    }
    const toAccount = req.body.to;
    const Amount = req.body.amount;
    const findAccount = await Account.findOne({
        UserId : toAccount
    }).session(session)
    if(!findAccount){
        session.abortTransaction()
        res.json({
            msg : " Invalid Account"
        }).status(400)
    }
    const findBalance = Account.findOne({
        UserId:req.userId
    }).session(session)
    if ( findBalance.balance < Amount ){
        session.abortTransaction()
       res.json({
        msg : "insufficient Balance"
       })   
    }

    await Account.updateOne({UserId:req.userId},{$inc : {balannce : -Amount}});
    await Account.updateOne({UserId:toAccount},{$inc : { balance:Amount}});

    res.json({
        msg : "Amount Transferred successfully"
    }).status(200)
})


module.exports= {
    accountRouter
}