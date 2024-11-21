import mongoose,{Schema} from "mongoose";

const projectSchema=Schema({
    projectName:{
        type:String,
        require:true
    },
    projectImage:{
        type:String
    },
    projectLink:{
        type:String,
        require:true 
    }
})

export const Project=mongoose.model("Project",projectSchema);

