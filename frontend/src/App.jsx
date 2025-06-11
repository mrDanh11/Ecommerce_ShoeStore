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
import CartPage from "./pages/CartPage";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import ForgotPassword from "./pages/authentication/ForgotPassword";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
>>>>>>> d24973a86fb96ad848d6413d47b6b140a66c0d0f
  )
};

export default App;