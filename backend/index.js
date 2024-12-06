const express = require("express");
const cors = require("cors");
const router = require("./routes");

const app = express();

app.use(cors())
app.use(express.json())

app.use("/api/v1",router)

app.post('/hi',(req,res)=>{
    res.json({
        msg : "hi"
    })
})


app.listen(3000, ()=>{
    console.log("The server is running in port 3000");
})