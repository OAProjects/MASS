// src/components/Home.js

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth";
import Logout from "../../components/Logout";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await AuthService.fetchUserDetails();
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div>
      <h1>Home Page</h1>
      {user && (
        <>
          <p>Welcome, {user.email}! you are role {user.role}</p>
          <Logout />
        </>
      )}
    </div>
  );
};

export default Home;
