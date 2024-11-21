import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AsyncWrap from "../utils/AsyncWrap.js";

const signUp = AsyncWrap(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password ) {
    throw new ApiError(400, "All field require");
  }

  const userfind = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userfind) {
    throw new ApiError(400, "Username or email already exsist");
  }

  const createUser = await User({
    username,
    email
  });

  let user = await User.register(createUser, password);

  req.login(user, (err) => {
    if (err) {
      throw new ApiError(400, "signup user error");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Successfully login"));
  });
});

const Login = AsyncWrap(async (req, res) => {
  if (!req.user) {
   throw new ApiError("Invalid email or password")
  }

  return res.status(200).json(new ApiResponse(200,  "Login successful"));
});

const userLogin=AsyncWrap(async(req,res)=>{
  if(!req.isAuthenticated()){
    throw new ApiError(400,"Plesae login first")
  }
  return res.status(200).json(new ApiResponse(200,"User login"))
})


const profileLogout = AsyncWrap(async (req, res) => {
  req.logout((err) => {
    if (err) {
      throw new ApiError(400, "Unuthrize request");
    }
  });

  // req.session.destroy();

  return res.status(200).json(new ApiResponse(200, "User logout"));
});

export { signUp, Login, profileLogout,userLogin };
