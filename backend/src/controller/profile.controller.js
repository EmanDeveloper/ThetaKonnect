import { Profile } from "../models/profile.models.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AsyncWrap from "../utils/AsyncWrap.js";

import { cloudinary } from "../utils/cloudinary.js";

const CreateProfile = AsyncWrap(async (req, res) => {
  // console.log(req.files)
  const { avatar, coverImage } = req.files;
  // console.log("Uploaded Avatar:", avatar[0]?.filename);
  // console.log("Uploaded Cover Image:", coverImage[0]?.filename);

  if (!req.isAuthenticated()) {
    throw new ApiError(401, "Please log in first.");
  }

  if(!avatar || !coverImage){
    throw new ApiError(400,"Avatar or coverImage missing")
  }
  // console.log(req.user?._id)
  const {
    username,
    about,
    skill,
    experience,
    education,
    linkdin,
    github,
  } = req.body;

  if ([username,about,skill,education].some((el)=>el.trim()==="")) {
    throw new ApiError(400, "All field required");
  }

  let user=await Profile.findOne({
    $or:[{username}]
  })

  if(user){
    throw new ApiError(400,"Username already exist");
  }

  // Check if the user already has a profile
let userProfile = await Profile.findOne({ owner: req.user._id });
if (userProfile) {
  throw new ApiError(400, "You already have a profile.");
}


  let profile = await Profile.create({
    username,
    avatar:
    avatar[0]?.path?.trim() == ""
        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXbHGJPHKrYtYQfPEoEcKGZpTnzIElvIMWvQ&s"
        :avatar[0]?.path,
    coverImage:
    coverImage[0]?.path?.trim() == ""
        ? "https://png.pngtree.com/thumb_back/fh260/background/20200217/pngtree-dark-blue-metallic-background-image_330066.jpg"
        : coverImage[0]?.path,
    about,
    skill,
    experience,
    education,
    linkdin,
    github,
    owner:req.user._id
  });

  if (!profile) {
    throw new ApiError(400,"Profile creation failed. Please try again ");
  }

  res.status(200).json(new ApiResponse(200, "Listing is created"));
});

const AllProfile = AsyncWrap(async (req, res) => {
  let AllProfile = await Profile.find({});
  res.status(200).json(new ApiResponse(200, AllProfile, "All listing"));
});

const UpdateProfile = AsyncWrap(async (req, res) => {
  const { id } = req.params;

  // Log request for debugging
  //console.log(req.files); // To check uploaded files
  //console.log(req.body);  // To check the fields sent in the request body

  const {
    username,
    about,
    skill,
    experience,
    education,
    linkdin,
    github,
  } = req.body;

  // Extract the avatar and coverImage files from the request if they exist
  const avatar = req.files?.avatar?.[0]?.path || null;
  const coverImage = req.files?.coverImage?.[0]?.path || null;

  const profile = await Profile.findById(id);


  let avatarUrl = profile.avatar;
  if (avatar) {
    // If a new avatar is provided, upload it to Cloudinary
    try {
      const avatarUpload = await cloudinary.uploader.upload(avatar, {
        folder: 'profiles/avatars', // specify the folder in Cloudinary
      });

      // Delete the old avatar from Cloudinary if it's not the default image
      if (profile.avatar && profile.avatar !== "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXbHGJPHKrYtYQfPEoEcKGZpTnzIElvIMWvQ&s") {
        const avatarPublicId = profile.avatar.split('/').slice(7).join('/').split('.')[0];
        await cloudinary.uploader.destroy(avatarPublicId);
      }
      avatarUrl = avatarUpload.secure_url; // Set the new avatar URL
    } catch (error) {
      console.error("Error uploading avatar to Cloudinary:", error);
      return res.status(500).json(new ApiResponse(500, "Failed to upload avatar to Cloudinary"));
    }
  }

  let coverImageUrl = profile.coverImage;
  if (coverImage) {
    // If a new cover image is provided, upload it to Cloudinary
    try {
      const coverImageUpload = await cloudinary.uploader.upload(coverImage, {
        folder: 'profiles/covers', // specify the folder in Cloudinary
      });

      // Delete the old cover image from Cloudinary if it's not the default image
      if (profile.coverImage && profile.coverImage !== "https://png.pngtree.com/thumb_back/fh260/background/20200217/pngtree-dark-blue-metallic-background-image_330066.jpg") {
        const coverImagePublicId = profile.coverImage.split('/').slice(7).join('/').split('.')[0];
        await cloudinary.uploader.destroy(coverImagePublicId);
      }
      coverImageUrl = coverImageUpload.secure_url; // Set the new cover image URL
    } catch (error) {
      console.error("Error uploading cover image to Cloudinary:", error);
      return res.status(500).json(new ApiResponse(500, "Failed to upload cover image to Cloudinary"));
    }
  }
  // Perform the update operation
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      {
        username,
        avatar: avatar || undefined, // If no avatar is provided, it won't update the avatar field
        coverImage: coverImage || undefined, // If no coverImage is provided, it won't update the coverImage field
        about,
        skill,
        experience,
        education,
        linkdin,
        github,
      },
      { new: true }
    );

    // If no profile is found, return an error
    if (!updatedProfile) {
      return res.status(404).json(new ApiResponse(404, "Profile not found"));
    }

    // Send success response
    return res.status(200).json(new ApiResponse(200, "Profile updated successfully", updatedProfile));
  } catch (err) {
    console.error(err);
    return res.status(500).json(new ApiResponse(500, "Failed to update profile", err.message));
  }
});


const showProfile=AsyncWrap(async(req,res)=>{
  const {id}=req.params;
  
  if(!id){
    throw new ApiError(400,"Profile not created");
  }

  let profile=await Profile.findById(id).populate("project").populate("owner");
  
  let check = profile.owner._id.equals(req.user?._id);
  // console.log(profile.owner._id,req.user?._id)
  // console.log(check)

 return res.status(200).json(new ApiResponse(200,profile,check,"Profile fetch successfully"))

})

const DeleteProfile =AsyncWrap( async (req, res) => {
 
    const { id } = req.params;

    const profile = await Profile.findById(id);

    if (profile.avatar && profile.avatar !== "default avatar URL") {
      const avatarPublicId = profile.avatar.split('/').slice(7).join('/').split('.')[0]; // Extract public_id
      try {
        await cloudinary.uploader.destroy(avatarPublicId); // Delete avatar image
      } catch (error) {
        console.error("Error deleting avatar from Cloudinary:", error);
        throw new ApiError(500, "Failed to delete avatar from Cloudinary.");
      }
    }

    if (profile.coverImage && profile.coverImage !== "default cover image URL") {
      const coverImagePublicId = profile.coverImage.split('/').slice(7).join('/').split('.')[0]; // Extract public_id
      try {
        await cloudinary.uploader.destroy(coverImagePublicId); // Delete cover image
      } catch (error) {
        console.error("Error deleting cover image from Cloudinary:", error);
        throw new ApiError(500, "Failed to delete cover image from Cloudinary.");
      }
    }

    let deleteProfile = await Profile.findByIdAndDelete(id);
    return res
      .status(200)
      .json(new ApiResponse(200, deleteProfile, "Profile is deleted"));
});


const currentUser=AsyncWrap(async(req,res)=>{
  if (!req.isAuthenticated()) {
    throw new ApiError(401, "Please log in first.");
  }
  return res.status(200).json(new ApiResponse(200,req.user._id))
})

export { CreateProfile, AllProfile,showProfile, UpdateProfile, DeleteProfile,currentUser };
