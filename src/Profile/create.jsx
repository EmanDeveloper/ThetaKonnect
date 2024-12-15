import TextField from "@mui/material/TextField";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import React from "react";
import { AnimatedBackground } from "animated-backgrounds";
import loadingimg from "../assets/loadin.png";

function Create() {
  const [create, setCreate] = useState({
    username: "",
    about: "",
    skill: "",
    experience: "",
    education: "",
    linkdin: "",
    github: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCreate({ ...create, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "avatar") {
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
      } else if (type === "coverImage") {
        setCoverImage(file);
        setCoverImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!create.username || !create.about || !create.education || !create.experience || !create.skill) {
      setError(true);
      toast.error("All field require!")
      return;
    }
    setError(false);
    setLoading(true); // Start loading

    const formData = new FormData();
    Object.entries(create).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (avatar) formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      await axios.post("https://thetakonnectbackend.onrender.com/profile/create", formData, {
        withCredentials: true,
      });
      navigate("/", {
        state: { toastMessage: "Profile successfully created!" },
      });
    } catch (er) {
      console.log(er);
      toast.error(`${er.response?.data?.message || "Something went wrong!"}`);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex-grow container mx-auto p-4">
      <AnimatedBackground
        animationName="fireflies"
        style={{ opacity: 0.3, zIndex: 0, pointerEvents: "none" }}
      />
      <div>
        <Toaster />
      </div>
      <h1 className="text-center text-blue-500 font-bold text-4xl p-5 z-50 relative">
        Create
      </h1>
      {loading ? (
        <div className="flex flex-grow justify-center items-center">
          <img src={loadingimg} alt="Loading..." className="z-40 " />
        </div>
      ) : (
      
       <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 max-w-lg mx-auto"
        >
          <TextField
            className="z-50"
            fullWidth
            id="fullWidth"
            label="Username"
            variant="filled"
            name="username"
            value={create.username}
            onChange={handleChange}
          />
          <label className="z-50 text-2xl">Profile Image</label>
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-52 rounded-md"
            />
          )}
          <input
            type="file"
            className="file-input file-input-bordered file-input-info w-full max-w-xs z-50"
            onChange={(e) => handleFileChange(e, "avatar")}
          />
          <label className="z-50 text-2xl">Cover Image</label>
          {coverImagePreview && (
            <img
              src={coverImagePreview}
              alt="Cover Image Preview"
              className="w-52 rounded-md z-40"
            />
          )}
          <input
            type="file"
            className="file-input file-input-bordered file-input-info w-full max-w-xs z-50"
            onChange={(e) => handleFileChange(e, "coverImage")}
          />
          <textarea
            className="border-2 border-gray-500 rounded-t-lg rounded-b-sm focus:border-blue-400 focus:outline-none p-5 font-medium z-50"
            rows={7}
            cols={26}
            placeholder="About"
            name="about"
            value={create.about}
            onChange={handleChange}
          />
          <TextField
            className="z-50"
            label="Education"
            variant="filled"
            name="education"
            value={create.education}
            onChange={handleChange}
          />
          <TextField
            className="z-50"
            label="Skill"
            variant="filled"
            name="skill"
            value={create.skill}
            onChange={handleChange}
          />
          <TextField
            className="z-50"
            label="Experience"
            variant="filled"
            name="experience"
            value={create.experience}
            onChange={handleChange}
          />
          <TextField
            className="z-50"
            label="Linkedin"
            variant="filled"
            name="linkdin"
            value={create.linkdin}
            onChange={handleChange}
          />
          <TextField
            className="z-50"
            label="GitHub"
            variant="filled"
            name="github"
            value={create.github}
            onChange={handleChange}
          />
          {error && <p className="text-red-500">All fields are required!</p>}
          <button className="btn btn-primary text-2xl font-bold text-white mb-5 py-2 px-6 z-50">
            Create
          </button>
        </form>
    
        
       
      )}
    </div>
  );
}

export default Create;
