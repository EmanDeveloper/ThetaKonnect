import dotenv from "dotenv"
import app from "./src/app.js";
import DBConnection from "./src/DB/DbConnect.js";


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
