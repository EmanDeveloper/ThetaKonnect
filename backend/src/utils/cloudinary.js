import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


dotenv.config({
    path:"./.env"
})


cloudinary.config({ 
  cloud_name: process.env.Cloudinary_Cloud_Name, 
  api_key: process.env.Cloudinary_Api_Key, 
  api_secret:  process.env.Cloudinary_Api_Secret
})

// Create a CloudinaryStorage instance
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Profilecreated",
        allowedFormats: ["png", "jpg", "jpeg"],
    },
});

export {
  cloudinary,
  storage }; 
