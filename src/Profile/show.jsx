import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaGithub, FaLinkedin, FaPlus } from "react-icons/fa";
import { GiCrossedBones } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import React from 'react';
import { AnimatedBackground } from 'animated-backgrounds';
import AOS from "aos";
import "aos/dist/aos.css";

import loadingimg from "../assets/loadin.png";

function Show() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();


  const [profile, setProfile] = useState(location.state?.profile || null);
  const [loading, setLoading] = useState(!profile);
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [addproject, setAddProject] = useState(false);

  const [project, setProject] = useState([]);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const [Projectdelete,setProjectdelete]=useState(false);
  const [Profiledelete,setProfileDelete]=useState(false);

  const [owner,setOwner]=useState(true)

  AOS.init();

  useEffect(() => {
    
    async function getProfile() {
      try {
        const profileId = profile ? profile._id : id;
        const response = await axios.get(
          `https://thetakonnectbackend.onrender.com/profile/show/${profileId}`,{withCredentials:true}
        );
        console.log("12",response.data);
        setOwner(response.data.message)
        setProfile(response.data.data);
        setProject(response.data.data.project);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, []);

  function handelEdit() {
    setEdit(true);
  }

  async function handelProfileDelete() {
    const profileId = profile ? profile._id : id;
    await axios.delete(`https://thetakonnectbackend.onrender.com/profile/delete/${profileId}`);
    navigate("/", { state: { toastMessage: "Profile deleted!" } });
  }


  function handelAddProject() {
    setAddProject(true);
  }

  function confirmProjectDelete(projectId) {
    setProjectToDelete(projectId);
    setDel(true);
  }

  async function deleteProject() {
    try {
      const profileId = profile ? profile._id : id;
      await axios.delete(`https://thetakonnectbackend.onrender.com/project/delete/${projectToDelete}/${profileId}`);
      setProject(project.filter((p) => p._id !== projectToDelete)); // Remove project from state
      setDel(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  }

  
  function handelProjectProfileDelete(){
    if(Projectdelete){
      deleteProject()
    }
    else if(Profiledelete){
      handelProfileDelete();
    }
  }

  if (addproject) {
    navigate(`/addProject/${profile._id}`, { state: { profile } });
  }

  if (loading) {
    return <div><img src={loadingimg} alt="" /></div>;
  }

  if (edit) {
   navigate("/update",{state:{profile}})
  }

  return (
    <div className="body container px-4 sm:px-6 lg:px-24 font-serif relative mb-10">
  <AnimatedBackground 
  animationName="starryNight"
  style={{ opacity: 0.5,zIndex:0, pointerEvents: 'none' }}  // Add any additional CSS styles
/>
      {del && (
        <>
          {/* Overlay with blur effect */}
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 "></div>

          {/* Confirmation Modal with Animation */}
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            data-aos="fade-down"
            data-aos-duration="500"
          >
            <div className="bg-slate-900 rounded-lg w-full sm:w-96 p-6 shadow-lg text-white z-50">
              <button onClick={() => setDel(false)} className="float-right mb-4">
                <GiCrossedBones className="text-blue-500 text-2xl " />
              </button>
              <div className="text-center mt-6">
                <h4 className="text-lg mb-4">
                  Are you sure you want to delete this project?
                </h4>
                <button
                  onClick={() => setDel(false)}
                  className="btn bg-blue-700 hover:bg-blue-600 text-white mx-2 "
                >
                  Cancel
                </button>
                <button
                  onClick={handelProjectProfileDelete}
                  className="btn bg-red-600 hover:bg-red-500 text-white mx-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Profile and other details */}
      <div className="showImages mt-4 w-full sm:w-5/6 lg:w-4/5 z-40">
        <img
          src={profile.coverImage}
          className="show-coverImage w-full rounded-lg"
          alt="Cover"
        />
        <img
          src={profile.avatar}
          className="show-Avatar w-32 h-32 sm:w-40 sm:h-40"
          alt="Avatar"
        />
        <h4 className="pt-10  text-2xl font-bold  pl-48 max-[620px]:pl-40">
          {profile.username}
        </h4>
      </div>

      {/* About Section */}
      <div className="show-about  overflow-hidden w-full sm:w-4/5 mt-40 bg-slate-900 p-6 rounded-lg shadow-md shadow-blue-900 z-40">
        <h3 className="text-3xl font-bold text-center text-blue-500 pb-4">
          About
        </h3>
        <p className="mt-2">{profile.about}</p>
      </div>

      {/* Education Section */}
      <div className="overflow-hidden w-full sm:w-4/5 mt-8 bg-slate-900 p-6 rounded-lg shadow-md shadow-blue-900 z-40">
        <h3 className="text-3xl font-bold text-blue-500 pb-4">Education</h3>
        <p>{profile.education}</p>
      </div>

      {/* Skill Section */}
      <div className="overflow-hidden w-full sm:w-4/5 mt-8 bg-slate-900 p-6 rounded-lg shadow-md shadow-blue-900 z-40">
        <h3 className="text-3xl font-bold text-blue-500 pb-4">Skill</h3>
        <p>{profile.skill}</p>
      </div>

      {/* Experience Section */}
      <div className="overflow-hidden w-full sm:w-4/5 mt-8 bg-slate-900 p-6 rounded-lg shadow-md shadow-blue-900 z-40">
        <h3 className="text-3xl font-bold text-blue-500 pb-4">Experience</h3>
        <p>{profile.experience}</p>
      </div>

      {/* Project Carousel */}
      <div className="carousel-container w-full sm:w-4/5 mt-8 rounded-box mb-5 pr-4 relative group z-40">
        {/* Header with Project Title and Add Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-blue-500 pb-4">
            Project
          </h3>
          {owner && <button
            className="btn text-white text-2xl sm:text-3xl mb-4"
            onClick={handelAddProject}
          >
            <FaPlus />
          </button>}
        </div>

        {/* Left Arrow Button (Visible on Hover) */}
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-blue-700 hover:bg-blue-600 text-white rounded-full p-2 m-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() =>
            document
              .getElementById("carousel")
              .scrollBy({ left: -300, behavior: "smooth" })
          }
        >
          ❮
        </button>

        {/* Carousel Container */}
        <div
          id="carousel"
          className="carousel flex overflow-x-auto space-x-4 sm:space-x-6 md:space-x-8 snap-x snap-mandatory"
        >
          {/* Card */}
          {project.map((el, i) => (
            <div
              className="card card-compact bg-base-100 w-80 sm:w-96 shadow-xl flex-shrink-0 h-80 snap-start"
              key={i}
            >
              <figure>
              {owner &&<button className="absolute cursor-pointer text-4xl text-red-500 opacity-0 group-hover:opacity-100 top-2 right-2"  onClick={() => {confirmProjectDelete(el._id);
                setProjectdelete(true);
              }}><MdDelete/></button>}
                <img
                  src={el.projectImage}
                  alt="Project"
                  className="w-full h-full object-cover"
                /> 
              </figure>
              <div className="card-body">
                <h2 className="card-title">{el.projectName}</h2>
                <div className="card-actions justify-end">
                  <Link
                    className="btn btn-primary"
                    target="_blanck"
                    to={el.projectLink}
                  >
                    Check
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Button (Visible on Hover) */}
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-700 hover:bg-blue-600 text-white rounded-full ml-4 p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() =>
            document
              .getElementById("carousel")
              .scrollBy({ left: 300, behavior: "smooth" })
          }
        >
          ❯
        </button>
      </div>

      {/* Social Links */}
      <div className="overflow-hidden w-full sm:w-4/5 mt-8 bg-slate-900 p-6 rounded-lg shadow-md shadow-blue-900 z-40">
        <h3 className="text-3xl font-bold text-blue-500 pb-2">Links</h3>
        <Link
          to={profile.github}
          target="_blank"
          className="flex gap-2 text-2xl basis-1 mt-2"
        >
          <FaGithub className="text-4xl group-hover:text-blue-500 transition-colors duration-300" />
          <span className="pt-2">GitHub</span>
        </Link>
        <Link
          to={profile.linkdin}
          target="_blank"
          className="flex gap-2 text-2xl basis-1 mt-4"
        >
          <FaLinkedin className="text-4xl group-hover:text-blue-500 transition-colors duration-300" />
          <span className="pt-2">LinkedIn</span>
        </Link>
      </div>

      {/* Edit and Delete Buttons */}
     {owner && <div className="flex flex-row-reverse mr-6 sm:mr-24 overflow-hidden mt-8 mb-6 z-40">
        <button
          className="btn bg-red-600 hover:bg-red-500 text-white"
          onClick={() => {setDel(true); setProfileDelete(true)}}
        >
          Delete
        </button>
        <button
          className="btn bg-blue-600 hover:bg-blue-500 text-white ml-4 mr-3"
          onClick={handelEdit}
        >
          Edit
        </button>
      </div>}
    </div>
  );
}

export default Show;
