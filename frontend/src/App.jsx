import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
<<<<<<< HEAD
import About from "./pages/About";

const App = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
=======
import Navbar from "./components/Navbar"; // Thêm dòng này
import Topbar from "./components/Topbar";

const App = () => {
  return (
    <>
      <Topbar />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
>>>>>>> d24973a86fb96ad848d6413d47b6b140a66c0d0f
  )
};

export default App;