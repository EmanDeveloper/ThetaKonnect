import mongoose,{Schema} from "mongoose";
import { Project } from "./project.models.js";

const ProfileSchema=new Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    avatar:{
        type:String, 
    },
    coverImage:{
        type:String,
    },
    about:{
        type:String,
        require:true
    },
    skill:{
        type:String,
        require:true
    },
    experience:{
        type:String
    },
    education:{
        type:String,
        require:true
    },
    project:[{
        type:Schema.Types.ObjectId,
        ref:"Project"
    }],
    linkdin:{
        type:String
    },
    github:{
        type:String
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

ProfileSchema.post("findOneAndDelete",async(profile)=>{
    if(profile.project.length){
       await Project.deleteMany({_id:{$in:profile.project._id}})
    }
})

export const Profile=mongoose.model("Profile",ProfileSchema)