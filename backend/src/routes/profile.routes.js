import { Router } from "express";
import {
  CreateProfile,
  AllProfile,
  UpdateProfile,
  DeleteProfile,
  showProfile,
  currentUser
} from "../controller/profile.controller.js";
import { userLogin } from "../middleware/login.middleware.js";
import { storage } from "../utils/cloudinary.js";

import multer from "multer"
const upload = multer({ storage: storage });


const router = Router();

router.route("/").get(AllProfile);
router.route("/show/:id").get(showProfile);
router.route("/create").post(upload.fields([{ name: 'avatar' }, { name: 'coverImage' }]),CreateProfile);
router.route("/update/:id").put(upload.fields([{ name: "avatar" }, { name: "coverImage" }]),UpdateProfile);
router.route("/delete/:id").delete(DeleteProfile);
router.route("/currentUser").get(currentUser)

export default router;
