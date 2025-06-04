import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Topbar from "./components/Topbar";
import ProductList from "./pages/shop/ProductList"; // 👈 Dòng này

const App = () => {
  return (
    <>
      <Topbar />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ProductList />} /> {/* 👈 Dòng này */}
      </Routes>
    </>
  );
};

export default App;
