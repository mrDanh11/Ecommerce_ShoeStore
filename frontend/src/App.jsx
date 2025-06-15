import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Navbar from "./components/Navbar"; // Thêm dòng này
import Cart from "./pages/Cart";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import CallBack from "./pages/authentication/CallBack";
import CheckoutPage from "./pages/CheckoutPage";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import Collections from "./pages/Collections";

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/callback" element={<CallBack />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
      <Footer />
    </div>
  )
};

export default App;
