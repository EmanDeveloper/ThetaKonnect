import dotenv from "dotenv";
import app from "./app.js";
import DBConnection from "./DB/DbConnect.js";


dotenv.config({
    path:"./.env"
})


DBConnection()
.then(()=>{
    app.listen(process.env.PORT ||3000,()=>{
        console.log("😎 App is listen at port 3000")
    })
})
.catch((err)=>{
    console.log("App error")
})
