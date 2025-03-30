import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { FaLock, FaPhone } from "react-icons/fa";
import { APP_INFO } from "../constants/common.constants";
import { useAuth } from "../utils/authUtils";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    passWord: "",
  });

  const navigate = useNavigate();
  const { signIn } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    try {
      await signIn(formData);
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#e8f3ff] flex flex-col justify-center items-center">
      <div className="text-center mb-4">
        <h1 className="text-[#0068ff] font-bold text-4xl">{APP_INFO.NAME}</h1>
        <h2>Đăng nhập tài khoản {APP_INFO.NAME}</h2>
        <h2>để kết nối với ứng dụng {APP_INFO.NAME} Web</h2>
      </div>

      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-center font-bold text-gray-900 mb-6">
          Đăng nhập với mật khẩu
        </h2>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-2">
            <Input
              name="phoneNumber"
              type="tel"
              required
              placeholder="Số điện thoại"
              value={formData.phoneNumber}
              onChange={handleChange}
              icon={FaPhone}
              autoComplete="tel"
            />
            <Input
              name="passWord"
              type="password"
              required
              placeholder="Mật khẩu"
              value={formData.passWord}
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

        <div className="text-center mt-6">
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
