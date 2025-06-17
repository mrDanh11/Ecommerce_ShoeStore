import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Topbar from "./components/Topbar";

// Trang người dùng
import HomeLanding from "./pages/shop/HomeLanding";
import ProductList from "./pages/shop/ProductList";

// Trang admin
import EmployeeManager from "./pages/admin/EmployeeManager";
import ProductStatistics from "./pages/admin/ProductStatistics";
import LandingPage from "./pages/admin/LandingPage";
import ProductManager from "./pages/admin/ProductManager";

const App = () => {
  return (
    <>
      <Topbar />
      <Navbar />
      <Routes>
        {/* Người dùng */}
        <Route path="/" element={<HomeLanding />} />
        <Route path="/shop" element={<ProductList />} />

        {/* Admin */}
        <Route path="/admin" element={<LandingPage />} />
        <Route path="/admin/products" element={<ProductManager />} />
        <Route path="/admin/employees" element={<EmployeeManager />} />
        <Route path="/admin/statistics" element={<ProductStatistics />} />
      </Routes>
    </>
  );
};

export default App;
