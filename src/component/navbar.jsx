import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo1.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const navigate = useNavigate();

  const checkLogin = async () => {
    try {
    let re=await axios.get("https://thetakonnectbackend.onrender.com/user/navLogin");
      setIsLoggedIn(true); 
    } catch (error) {
      setIsLoggedIn(false); 
    }
  };

 async function logout() {
    try {
      await axios.get("https://thetakonnectbackend.onrender.com/user/userlogout", { withCredentials: true });
      setIsLoggedIn(false);
      toast.success("Logged out successfully");
      navigate("/",{ replace: true } )
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  useEffect(() => {
    checkLogin(); 
  });

  const createProfile = () => {
    if (!isLoggedIn) {
      toast.error("Please login first!");
      return;
    }
    navigate("/create");
  };

  return (
    <div className="overflow-hidden">
      <Toaster />
      <div className="navbar bg-base-100 z-40 relative px-4">
        <div className="flex-1">
          <Link
            to="/"
            className="btn btn-ghost text-xl text-blue-500 hover:bg-inherit mt-0"
          >
            <img src={logo} alt="Logo" className="w-24 rounded-md" />
          </Link>
        </div>
        <div className="flex-none hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-4">
            <li>
              <button onClick={createProfile} className="btn text-white text-xl border-blue-800 p-2">Create profile</button>
            </li>
            {isLoggedIn ? (
              <li>
                <button onClick={logout} type="submit" className="btn bg-red-600 text-white text-xl">
                  Logout
                </button>
              </li>
            ) : (
              <>
                <Link className="btn bg-primary text-white text-xl mr-2 ml-2" to="/signup">
                  Signup
                </Link>
                <Link className="btn bg-red-600 text-white text-xl" to="/login">
                  Login
                </Link>
              </>
            )}
          </ul>
        </div>
        <div className="flex lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-ghost text-xl text-blue-500 hover:bg-inherit"
          >
            ☰
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden">
          <ul className="menu bg-base-100 p-4">
            <li>
              <button onClick={createProfile}>Create profile</button>
            </li>
            {isLoggedIn ? (
              <li>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="btn bg-red-600 text-white text-lg mt-2"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/signup"
                    className="btn bg-primary text-white text-lg mt-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Signup
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="btn bg-red-600 text-white text-lg mt-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
