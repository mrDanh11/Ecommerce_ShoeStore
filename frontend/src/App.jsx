import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Navbar from "./components/Navbar"; // Thêm dòng này
import Cart from "./pages/Cart";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import ResetPassword from "./pages/authentication/ResetPassword";
import CallBack from "./pages/authentication/CallBack";
import Profile from "./pages/Profile";
import CheckoutPage from "./pages/CheckoutPage";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import Collections from "./pages/Collections";
import EmployeeManager from "./pages/admin/EmployeeManager";
import ProductStatistics from "./pages/admin/ProductStatistics";
import PromotionManager from "./pages/admin/PromotionManager";
import LandingPage from "./pages/admin/LandingPage";
import OrderManager from "./pages/admin/OrderManager";
import OrderHistory from "./pages/OrderHistory";
import Success from "./pages/shop/Success";
import OrderPage from "./pages/OrderPage";
import SaleOffManager from "./pages/admin/SaleOffManager";
import ProductDetail from "./pages/ProductDetail";
import LandingPageHome from "./pages/LandingPageHome";
import RequireAdmin from "./components/RequireAdmin";
import OrderConfirmation from "./pages/shop/OrderConfirmation";

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPageHome />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/callback" element={<CallBack />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<Success />} />
        <Route path="/checkout/fail" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/order" element={ <OrderPage />} />
        <Route path="/admin" element={<RequireAdmin><LandingPage /></RequireAdmin>} />
        <Route path="/admin/employees" element={<RequireAdmin><EmployeeManager /></RequireAdmin>} />
        <Route path="/admin/statistics" element={<RequireAdmin><ProductStatistics /></RequireAdmin>} />
        <Route path="/admin/promotions" element={<RequireAdmin><PromotionManager /></RequireAdmin>} />
        <Route path="/admin/order-manager" element={<RequireAdmin><OrderManager /></RequireAdmin>} />
        <Route path="/admin/sale-offs" element={<RequireAdmin><SaleOffManager /></RequireAdmin>} />
        <Route path="/order-history" element={<OrderHistory />} />
      </Routes>
      <Footer />
    </div>
  )
};

export default App;
