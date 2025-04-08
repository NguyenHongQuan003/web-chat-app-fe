import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../utils/authUtils";
import {
  getCurrentUser,
  login,
  logout,
} from "../services/authService";
import { setupInterceptors } from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const setAccessToken = (token) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  };

  useEffect(() => {
    setupInterceptors(navigate, setAccessToken);
  }, [navigate]);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi tải trang
    const checkAuth = async () => {
      try {
        if (!user) {
          const res = await getCurrentUser();
          // console.info("User login:", res);
          setUser(res);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [user]);

  const signIn = async (userData) => {
    try {
      const data = await login(userData);
      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch (error) {
      throw new Error("Phone number or password is incorrect", error);
    }
  };

  const signOut = async () => {
    try {
      await logout();
      setAccessToken(null);
      setUser(null);
      navigate("/login");
    } catch (error) {
      throw new Error("Logout failed", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
