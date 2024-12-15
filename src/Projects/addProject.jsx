import { useState } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import loading1 from "../assets/loadin1.png";

function AddProject() {
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = location.state;

  const [project, setProject] = useState({
    projectName: "",
    projectImage: null,
    projectLink: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);  

  // Handle text and file changes
  function handleChange(e) {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setProject({ ...project, [name]: file });
      setImagePreview(URL.createObjectURL(file)); // Set preview for the image
    } else {
      setProject({ ...project, [name]: value });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!project.projectName || !project.projectLink ) {
      setError(true);
      toast.error("All fields are required!");
      return;
    } 
      setError(false);
      setLoading(true);

    try {
      // Prepare FormData
      const formData = new FormData();
      formData.append("projectName", project.projectName);
      formData.append("projectImage", project.projectImage);
      formData.append("projectLink", project.projectLink);

      // Debugging FormData
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Send request
      const response = await axios.post(
        `https://thetakonnectbackend.onrender.com/project/add/${profile._id}`,
        formData,
        { withCredentials: true }
      );

      console.log(response);
      navigate(`/show/${profile._id}`, {
        state: { toastMessage: "New project added!" },
      });
      toast.success("Project added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add project.");
      setLoading(false);
    }
  }

  return (
    <div className="body container max-w-lg mx-auto p-4">
      <Toaster />
      <h1 className="text-center text-blue-500 font-bold text-4xl p-5">
        Add Project
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          fullWidth
          id="fullWidth"
          label="Project Name"
          variant="filled"
          name="projectName"
          value={project.projectName}
          onChange={handleChange}
          className="mb-4"
        />

        {/* Image Preview and File Input */}
        <label className="z-50 text-2xl">Project Image</label>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Project Preview"
            className="w-52 rounded-md mb-4"
          />
        )}
        <input
          type="file"
          name="projectImage"
          className="file-input file-input-bordered file-input-info w-full max-w-xs z-50"
          onChange={handleChange}
        />

        <TextField
          label="Project Link"
          variant="filled"
          name="projectLink"
          value={project.projectLink}
          onChange={handleChange}
          className="mb-4"
        />

        {error && (
          <p className="text-red-500 text-center">All fields are required!</p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-2xl font-bold text-white py-2 px-6 rounded-md mt-4 mx-auto"
        >
          Add Project
        </button>
      </form>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <img src={loading1} alt="Loading" className="w-32 h-32" />
        </div>
      )}
    </div>
  );
}

export default AddProject;
