    import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "1") {
      navigate("/"); // Không phải admin thì quay về trang chủ
    }
  }, []);

  return children;
};

export default RequireAdmin;
