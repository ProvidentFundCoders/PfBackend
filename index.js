require("dotenv").config();
const express = require("express");
const app = express();

app.get("/", (req,res)=>{
    res.send("Provident Fund Project Backend is under construction")
})

app.listen(process.env.PORT, ()=>{
    console.log("Server is running")
})
