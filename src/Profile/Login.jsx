import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import React from "react";
import { AnimatedBackground } from "animated-backgrounds";

function Login() {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setLogin({ ...login, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!login.email || !login.password) {
      setError(true);
      toast.error("All field require");
      return;
    } else {
      setError(false);
    }
    try {
      await axios.post(
        `https://thetakonnectbackend.onrender.com/user/login`,
        login,
        { withCredentials: true }
      );
      navigate(`/`, { state: { toastMessage: "User login successfully!" } });
    } catch (err) {
      toast.error("Email or password incorrect");
    }
  }

  const [animationName, setAnimationName] = useState("starryNight");
  useEffect(() => {
    const animations = [
      "rainbowWaves",
      "floatingBubbles",
      "gradientWave",
      "particleNetwork",
      "galaxySpiral",
    ];
    const storedIndex = localStorage.getItem("backgroundAnimationIndex");
    const newIndex = storedIndex
      ? (parseInt(storedIndex) + 1) % animations.length
      : 0;
    setAnimationName(animations[newIndex]);
    localStorage.setItem("backgroundAnimationIndex", newIndex.toString());
  }, []);

  return (
    <div className="form-bg-img">
      <div className="body container max-w-lg mx-auto p-4">
        <AnimatedBackground
          animationName={animationName}
          style={{ opacity: 0.5, zIndex: 0, pointerEvents: "none" }}
        />
        <Toaster />
        <h1 className="text-center  font-bold text-4xl p-5 z-30">Login</h1>
        <div className="form-bg mb-16">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-10">
            <TextField
              label="email"
              variant="filled"
              name="email"
              value={login.email}
              onChange={handleChange}
              className="mb-4 bg-gray-800 rounded-t-md"
            />
            <TextField
              label="password"
              variant="filled"
              type="password"
              name="password"
              value={login.password}
              onChange={handleChange}
              className="mb-4 bg-gray-800 rounded-t-md "
            />
            {error && (
              <p className="text-red-500 text-center">
                All fields are required!
              </p>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-2xl font-bold text-white py-2 px-6 rounded-md mt-4 mx-auto"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
