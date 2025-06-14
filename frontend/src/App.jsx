import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Topbar from "./components/Topbar";
import ProductList from "./pages/shop/ProductList"; // 👈 Dòng này
import EmployeeManager from "./pages/admin/EmployeeManager";
import ProductStatistics from "./pages/admin/ProductStatistics";
import LandingPage from "./pages/admin/LandingPage";



const App = () => {
  return (
    <>
      <Topbar />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ProductList />} /> {/* 👈 Dòng này */}
        <Route path="/admin/employees" element={<EmployeeManager />} />
        <Route path="/admin/statistics" element={<ProductStatistics />} />
        <Route path="/admin" element={<LandingPage />} />
      </Routes>
    </>
  );
};

export default App;
