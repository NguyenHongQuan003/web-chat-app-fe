import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../utils/authUtils";
import {
  getCurrentUser,
  login,
  logout,
  refreshToken,
} from "../services/authService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        if (error.status === 410) {
          try {
            await refreshToken();
            const res = await getCurrentUser();
            setUser(res);
          } catch (refreshError) {
            console.error("Error refreshing token: ", refreshError);
            setUser(null);
          }
        } else {
          console.error("Error getting user login: ", error);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [user]);

  const signIn = async (userData) => {
    try {
      const data = await login(userData);
      setUser(data.user);
    } catch (error) {
      throw new Error("Phone number or password is incorrect", error);
    }
  };

  const signOut = async () => {
    try {
      await logout();
      setUser(null);
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
