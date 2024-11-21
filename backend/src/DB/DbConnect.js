import mongoose from "mongoose";

async function DBConnection(){
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB');
    }
    catch(err){
        console.log("mongoose connect error")
    }
}

export default  DBConnection;
