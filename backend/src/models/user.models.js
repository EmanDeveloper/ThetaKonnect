import mongoose,{Schema} from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"


const userSchema=new Schema({
    username:{
        type:String
    },
    email:{
        type:String,
        required: true,
        lowercase: true,
        trim: true, 
        unique:true
    },
    password:{
        type:String
    }
},{timestamps:true});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export const User=mongoose.model("User",userSchema)