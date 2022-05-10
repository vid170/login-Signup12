const mongoose=require("mongoose");

mongoose.connect(process.env.DATABASE,{useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{console.log("connnection successful"); }).catch((e)=>{console.log("no connection", e);});