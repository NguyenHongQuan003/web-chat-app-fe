import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../utils/authUtils";
import { getCurrentUser, login, logout } from "../services/authService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Định nghĩa PropTypes

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi tải trang
    const checkAuth = async () => {
      try {
        if (!user) {
          const res = await getCurrentUser();
          console.log("Du lieu tra ve tu server khi lay thong tin user", res);
          setUser(res); // Cập nhật user nếu đã đăng nhập
        }
      } catch (error) {
        console.error("Không có phiên đăng nhập:", error);
        setUser(null); // Reset user nếu không có cookie hợp lệ
      } finally {
        setLoading(false); // Hoàn tất kiểm tra
      }
    };
    checkAuth();
  }, [user]);

  const signIn = async (userData) => {
    try {
      const data = await login(userData);
      setUser(data.user);
    } catch (error) {
      console.log("Loi khi dang nhap", error);
    }
  };

  const signOut = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.log("Loi khi dang xuat", error);
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
