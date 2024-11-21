import { Router } from "express";
import { addProject, deleteProject } from "../controller/project.controller.js";

import { storage } from "../utils/cloudinary.js";

import multer from "multer";
const upload = multer({ storage: storage });

const router = Router();

router.route("/add/:id").post(upload.single("projectImage"),addProject);
router.route("/delete/:projectId/:profileId").delete(deleteProject);

export default router;
