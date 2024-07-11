import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.removeToken();
    navigate("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
