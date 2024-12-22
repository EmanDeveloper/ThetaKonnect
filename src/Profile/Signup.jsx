import { useState,useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

function Signup() {

    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const [signup, setSignup] = useState({
        username:"",
        email:"",
        password:""
    });

    function handleChange(e) {
        setSignup({ ...signup, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!signup.username || !signup.email || !signup.password ) {
            setError(true);
            toast.error("All field require")
            return;
        } else {
            setError(false);
        }

        try {
            let response = await axios.post(`https://thetakonnectbackend.onrender.com/user/signup`, signup,{withCredentials:true});
            console.log(response);
            navigate(`/`);
        } catch (err) {
            toast.error(err.response.data.message);
        }
    }


    return (
        <div className="form-bg-img w-full">
             <div className="body container max-w-lg mx-auto p-4 ">
            <Toaster />
            <h1 className="text-center font-bold text-4xl p-5 z-30">
                Signup
            </h1>
            <div className="form-bg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 z-30 m-8">
                <TextField
                    fullWidth
                    id="fullWidth"
                    label="Username"
                    variant="filled"
                    name="username"
                    value={signup.username}
                    onChange={handleChange}
                    className="mb-4"
                />
                <TextField
                    label="email"
                    variant="filled"
                    name="email"
                    value={signup.email}
                    onChange={handleChange}
                    className="mb-4"
                />
                <TextField
                    label="password"
                    variant="filled"
                    type="password"
                    name="password"
                    value={signup.password}
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
                    Signup
                </button>
            </form>
            </div>
           
        </div>
        </div>
       
    );
}

export default Signup;
