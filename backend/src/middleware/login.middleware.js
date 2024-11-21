import ApiError from "../utils/ApiError.js";
import AsyncWrap from "../utils/AsyncWrap.js";

const userLogin=AsyncWrap(async(req,res,next)=>{
  console.log(req.user)
    if(!req.isAuthenticated()){
      throw new ApiError(400,"Plesae login first backend")
    }
    next();
})

export{userLogin}