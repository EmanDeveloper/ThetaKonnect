import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Avatar from "@mui/material/Avatar";
import toast, { Toaster } from "react-hot-toast";
import React from 'react';
import { AnimatedBackground } from 'animated-backgrounds';


function AllProfile() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function profile() {
      let response = await axios.get("https://thetakonnectbackend.onrender.com/profile",{ withCredentials: true });
      setData(response.data.data);
    }
    profile();

    const hasShownWelcomeToast = sessionStorage.getItem("hasShownWelcomeToast");

    if (!hasShownWelcomeToast) {
      toast.success("Welcome!");
      sessionStorage.setItem("hasShownWelcomeToast", "true");
    }


    if (location.state?.toastMessage) {
      if (location.state.toastMessage === "User login successfully!") {
        toast.success(location.state.toastMessage);
        navigate(location.pathname, { replace: true });
      }
    }
  }, [location.state]);

  function handelShow(profile) {
    navigate(`/show/${profile._id}`, { state: { profile } });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground animationName="auroraBorealis"
       style={{ opacity: 0.4,zIndex:0, pointerEvents: 'none' }} />
      <div className="flex-grow px-4 pt-6 pb-12 font-serif">
        <Toaster />
        <Grid container spacing={4} justifyContent="center">
          {data.map((el, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card className="shadow-lg rounded-lg overflow-hidden glass">
                <CardActionArea>
                  <CardMedia
                    component="img"
                    sx={{ height: 200 }}
                    image={el.coverImage}
                    alt="Profile Cover"
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      className="flex items-center gap-2"
                    >
                      <Avatar alt={el.username} src={el.avatar} />
                      <span>{el.username}</span>
                    </Typography>
                    <button
                      className="btn btn-primary float-right  mb-2"
                      onClick={() => handelShow(el)}
                    >
                      Explore
                    </button>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      
    </div>
  );
}

export default AllProfile;
