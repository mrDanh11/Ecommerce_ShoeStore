import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar"; // Thêm dòng này
import CartPage from "./pages/CartPage";

const App = () => {
  return (
    <>
      {/* <Topbar /> */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  )
};

export default App;