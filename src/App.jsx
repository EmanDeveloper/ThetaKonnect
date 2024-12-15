import AllProfile from "./Profile/Home";
import Show from "./Profile/show";
import Create from "./Profile/create";
import Footer from "./component/footer";
import Navbar from "./component/navbar";
import Update from "./Profile/update";
import SignUp from "./Profile/Signup";
import Login from "./Profile/Login";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import AddProject from "./Projects/addProject";


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <Container>
      <Routes>
        <Route path="/" element={<AllProfile />} />
        <Route path="/show/:id" element={<Show />} />
        <Route path="/create" element={<Create />} />
        <Route path="/addProject/:id" element={<AddProject/>}/>
        <Route path="/update" element={<Update/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
       </Container>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
