const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken")
const userSchema=new mongoose.Schema({
   
    first_name:{type:String,required:true},
    last_name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    address:{type:String,required:true},
    dob:{type:String ,required: true},
    gender:{type:String,required:true},
    password:{type:String,required: true},
    photo:{data:Buffer,contentType:String},
    tokens:[{
        token:{type:String,required:true}
    }]

})

userSchema.methods.generateAuthToken= async function()
{
    try{
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    }
    catch(error)
    {
     res.send("error" + error)
    }
}

userSchema.pre("save",async function(next){
  if(this.isModified("password")){
      this.password=await bcrypt.hash(this.password,10);
 
    next(); // tells what to do aftre hashing
  }
})

const User=new mongoose.model("User",userSchema);
module.exports=User;