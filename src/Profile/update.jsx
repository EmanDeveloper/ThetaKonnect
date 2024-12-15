import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import toast, { Toaster } from "react-hot-toast";
import { AnimatedBackground } from "animated-backgrounds";
import axios from "axios";
import loading1 from "../assets/loadin1.png";

function Update() {
  const location = useLocation();
  const data = location.state;
  const [item] = useState(data.profile);

  const [edit, setEdit] = useState({
    _id: item._id,
    username: item.username,
    avatar: item.avatar,
    coverImage: item.coverImage,
    about: item.about,
    education: item.education,
    skill: item.skill,
    experience: item.experience,
    linkdin: item.linkdin,
    github: item.github,
  });

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);  // Loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      // If file input, update with file
      setEdit({ ...edit, [name]: files[0] });
    } else {
      setEdit({ ...edit, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (
      [
        edit.username,
        edit.about,
        edit.education,
        edit.skill,
        edit.experience,
      ].some((el) => el?.trim() === "")
    ) {
      toast.error("All fields are required!");
      setError(true);
      return;
    }
    setError(false);

    // Set loading to true when the update starts
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(edit).forEach((key) => {
        formData.append(key, edit[key]);
      });

      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Make the PUT request
      await axios.put(
        `https://thetakonnectbackend.onrender.com/profile/update/${edit._id}`,
        formData,
        { withCredentials: true }
      );

      // Redirect to the show page after successful update
      navigate(`/show/${edit._id}`, { state: { profile: edit } });
      toast.success("Profile updated successfully!");

      // Set loading to false when the update completes
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
      
      // Set loading to false in case of error
      setLoading(false);
    }
  };

  return (
    <div className="body container max-w-lg flex gap-2 mx-auto">
      <AnimatedBackground
        animationName="cosmicDust"
        style={{ opacity: 0.3, zIndex: 0, pointerEvents: "none" }}
      />
      <div>
        <Toaster />
      </div>
      <h1 className="text-blue-500 font-bold text-4xl p-5 pl-0 relative">
        Update
      </h1>
      <form
        onSubmit={handleSubmit}
        className="container flex flex-col gap-1 mx-auto relative z-50"
      >
        <TextField
          label="Username"
          variant="filled"
          name="username"
          value={edit.username}
          onChange={handleChange}
        />
        <br />

        {/* Display Avatar Image */}
        <div>
          <p className="text-2xl p-2">Profile Image</p>
          {edit.avatar && typeof edit.avatar === "string" ? (
            <img
              src={edit.avatar}
              alt="Profile"
              className="w-52 rounded-md mb-2"
            />
          ) : (
            edit.avatar &&
            typeof edit.avatar === "object" && (
              <img
                src={URL.createObjectURL(edit.avatar)}
                alt="Profile"
                className="w-52 rounded-md mb-2"
              />
            )
          )}
        </div>
        <input
          type="file"
          name="avatar"
          className="file-input file-input-bordered file-input-info w-full max-w-xs z-50"
          onChange={handleChange}
        />
        <br />

        {/* Display Cover Image */}
        <div>
          <p className="text-2xl p-2">Cover Image</p>
          {edit.coverImage && typeof edit.coverImage === "string" ? (
            <img
              src={edit.coverImage}
              alt="Cover"
              className="w-52 rounded-md mb-2"
            />
          ) : (
            edit.coverImage &&
            typeof edit.coverImage === "object" && (
              <img
                src={URL.createObjectURL(edit.coverImage)}
                alt="Cover"
                className="w-52 rounded-md mb-2"
              />
            )
          )}
        </div>
        <input
          type="file"
          name="coverImage"
          className="file-input file-input-bordered file-input-info w-full max-w-xs z-50"
          onChange={handleChange}
        />
        <br />

        <textarea
          className="border-2 border-gray-500 rounded-t-lg rounded-b-sm focus:border-blue-400 focus:outline-none p-5 font-medium"
          rows={7}
          cols={26}
          placeholder="About"
          name="about"
          value={edit.about}
          onChange={handleChange}
        />
        <br />
        <TextField
          label="Education"
          variant="filled"
          name="education"
          value={edit.education}
          onChange={handleChange}
        />
        <br />
        <TextField
          label="Skill"
          variant="filled"
          name="skill"
          value={edit.skill}
          onChange={handleChange}
        />
        <br />
        <TextField
          label="Experience"
          variant="filled"
          name="experience"
          value={edit.experience}
          onChange={handleChange}
        />
        <br />
        <TextField
          label="LinkedIn"
          variant="filled"
          name="linkdin"
          value={edit.linkdin}
          onChange={handleChange}
        />
        <br />
        <TextField
          label="GitHub"
          variant="filled"
          name="github"
          value={edit.github}
          onChange={handleChange}
        />
        <br />

        {error && <p className="text-red-500 text-2xl">All fields required!</p>}

        <button className="btn btn-primary text-2xl font-bold text-white mb-5">
          Edit
        </button>
      </form>

      {/* Show loading indicator if loading is true */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <img src={loading1} alt="Loading" className="w-32 h-32" />
        </div>
      )}
    </div>
  );
}

export default Update;
