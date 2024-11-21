import { Router } from "express";
import { signUp,Login,profileLogout,userLogin} from "../controller/user.controller.js";
import passport from "passport";


const router =Router()

router.route("/signup").post(signUp);
router.route("/login").post(passport.authenticate('local',{ failureMessage: true }),Login)
router.route("/userlogout").get(profileLogout)
router.route("/navlogin").get(userLogin)


export default router