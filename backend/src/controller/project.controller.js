import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AsyncWrap from "../utils/AsyncWrap.js";
import { Project } from "../models/project.models.js";
import { Profile } from "../models/profile.models.js";
import { cloudinary} from "../utils/cloudinary.js"

const addProject = AsyncWrap(async (req, res) => {
    // console.log(req.body)
    // console.log(req.file)
    const { id } = req.params;
    let { projectName,projectLink } = req.body;

    
    if (!projectName || !projectLink) {
        throw new ApiError(400, "Project name and link are required.");
    }
    // console.log(req.file?.path);
    const project = await Project.create({
        projectName,
        projectImage: !req.file || req.file?.path?.trim() === "" ? 
        "https://png.pngtree.com/thumb_back/fh260/background/20231010/pngtree-energetic-university-student-engaged-in-laptop-work-3d-illustration-image_13571920.png" : 
        req.file?.path,
        projectLink
    });

    if (!project) {
        throw new ApiError(400, "Project could not be added, please try again.");
    }

    let profile = await Profile.findById(id);
    if (!profile) {
        throw new ApiError(404, "Profile not found.");
    }

    profile.project.push(project); 
    let p= await profile.save();
 

    return res.status(201).json(new ApiResponse(201, "Project added successfully", project));
});

const deleteProject = AsyncWrap(async (req, res) => {
    const { projectId, profileId } = req.params;
    if (!profileId || !projectId) {
        throw new ApiError(400, "Unauthorized request");
    }

    const project = await Project.findById(projectId);
    // console.log(project)

    if (project.projectImage && project.projectImage !== "https://png.pngtree.com/thumb_back/fh260/background/20231010/pngtree-energetic-university-student-engaged-in-laptop-work-3d-illustration-image_13571920.png") {
        // Extract public_id from Cloudinary URL
        const imageUrl = project.projectImage;
        const publicId = imageUrl.split('/').slice(7).join('/').split('.')[0]; // Extract public_id from URL
        
        // console.log("Deleting image with public_id:", publicId);

        try {
            // Delete image from Cloudinary
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error("Error deleting image from Cloudinary:", error);
            throw new ApiError(500, "Failed to delete the image from Cloudinary.");
        }
    }

    await Project.findByIdAndDelete(projectId);
    await Profile.findByIdAndUpdate(profileId,
        { $pull: { project: projectId } },
        { new: true }
    );
    return res.status(200).json(new ApiResponse(200, "Project deleted successfully!"));
});

export { addProject, deleteProject };
