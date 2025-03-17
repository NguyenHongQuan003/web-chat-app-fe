import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { FaLock, FaPhone } from "react-icons/fa";
import { APP_INFO } from "../constants/common.constants";

const Login = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic đăng nhập ở đây
    console.log("Form submitted:", formData);
    navigate("/home");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Đăng nhập {APP_INFO.NAME}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Kết nối với bạn bè và gia đình
          </p>
        </div>
        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-2">
            <Input
              name="phone"
              type="tel"
              required
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              icon={FaPhone}
              autoComplete="tel"
            />
            <Input
              name="password"
              type="password"
              required
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              icon={FaLock}
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" fullWidth>
              Đăng nhập
            </Button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
