const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Emaili daxil edin"],
    validate: {
      validator: validator.isEmail,
      message: "Email düzgün deyil",
    },
    unique: true,
    index: true,
    lowercase:true,
    trim:true,
   
  },
  username: {
    type: String,
    unique: true,
    required: [true, "İstiadəçi adını daxil edin"],
    index: true,
    minLength:[3,"İstifadəçi adının uzunluğu 3 dən çox olmalıdır"]
  },
  userrole:{type:String,default:"user",enum:["user","admin"]},
  password: { type: String, required: [true, "Kodu daxil edin"], minLength:[8,"Kodun uzunluğu ən az 8 olmalıdır"],validate:{
    validator:validator.isStrongPassword,
    message:"Ən az 1 ədəd kiçik,1 ədəd böyük,1 ədəd rəqəm və 1 ədəd simbol olmalıdır"
  }},
});

userSchema.pre("save",async function(next){
    let salt = await bcrypt.genSalt(14);
    this.password =await bcrypt.hash(this.password,salt); 
    next();
})


const User = mongoose.model("User",userSchema)

module.exports = User;

