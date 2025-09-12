import mongoose,{Schema, Types} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema(
  {
    username:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
      index:true
    },
    email:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
    },
    fullname:{
      type:String,
      required:true,
      index:true,
      trim:true,
    },
    avatar:{
      type:String, //cloudinary url (service like aws)
      required:true,
    },
    coverimage:{
      type:String, //cloudinary url (service like aws)
    },
    watchhistory:[
      {
        type:Schema.Types.ObjectId,
        ref:'Video'
      }
    ],
    password:{
      type:String,
      required:[true,"password is required"]
    },
    refreshTokens:{
      type:String
    }
  },{
    timestamps:true
  }
)
userSchema.pre("save",async function (next){
  if(this.modified("password")) return next();
  this.password = bcrypt.hash(this.password, 10)
  next();
})

userSchema.methods.isPasswordCorrect= async function (password) {
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessTokens = function () {
  return jwt.sign(
    {
      _id:this._id,
      username:this.username,
      email:this.username,
      fullname:this.fullname

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
     expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}


userSchema.methods.generateRefreshTokens = function () {
  return jwt.sign(
    {
      _id:this._id,
    

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
     expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}





export const user = mongoose.model("User",userSchema)