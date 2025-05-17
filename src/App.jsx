import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar"; // Thêm dòng này

const App = () => {
  return (
    <>
      <Navbar /> {/* Thêm navbar ở đầu */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
