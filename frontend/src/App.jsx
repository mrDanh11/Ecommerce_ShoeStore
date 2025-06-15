import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Navbar from "./components/Navbar"; // Thêm dòng này
import CartPage from "./pages/CartPage";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import CallBack from "./pages/authentication/CallBack";
import Profile from "./pages/Profile";
import CheckoutPage from "./pages/CheckoutPage";
import Footer from "./components/Footer";
import EmployeeManager from "./pages/admin/EmployeeManager";
import ProductStatistics from "./pages/admin/ProductStatistics";
import PromotionManager from "./pages/admin/PromotionManager";
import LandingPage from "./pages/admin/LandingPage";
 

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/callback" element={<CallBack />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin/employees" element={<EmployeeManager />} />
        <Route path="/admin/statistics" element={<ProductStatistics />} />
        <Route path="/admin/promotions" element={<PromotionManager />} />
        <Route path="/admin" element={<LandingPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
