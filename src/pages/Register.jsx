// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import { FaLock, FaPhone, FaUser } from "react-icons/fa";
import Button from "../components/common/Button";
import { APP_INFO } from "../constants/common.constants";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    confirm_password: "",
  });

  const validatePhone = (phone) => {
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
      return "Số điện thoại không hợp lệ";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    return "";
  };

  const validateConfirmPassword = (confirm_password) => {
    if (confirm_password != formData.password) {
      return "Mật khẩu không khớp";
    }
    return "";
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errors.phone || errors.password || errors.confirm_password) {
      alert("Vui lòng kiểm tra lại thông tin");
      return;
    }
    // Xử lý logic đăng ký ở đây
    console.log("Form submitted:", formData);
    navigate("/"); // Chuyển hướng đến trang chủ sau khi đăng ký thành công
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "phone") {
      setErrors({ ...errors, phone: validatePhone(value) });
    }
    if (name === "password") {
      setErrors({
        ...errors,
        password: validatePassword(value),
      });
      if (formData.confirm_password != "") {
        setFormData((prev) => ({
          ...prev,
          confirm_password: "",
        }));
      }
    }
    if (name === "confirm_password") {
      setErrors({
        ...errors,
        confirm_password: validateConfirmPassword(value),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Đăng ký tài khoản mới
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-2">
            {/* Tên người dùng */}
            <Input
              type="text"
              name="fullname"
              placeholder="Tên người dùng"
              icon={FaUser}
              required
              autoComplete="name"
              onChange={handleChange}
              value={formData.fullname}
            />
            {/* Số điện thoại */}
            <Input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              icon={FaPhone}
              required
              autoComplete="phone"
              onChange={handleChange}
              value={formData.phone}
              error={errors.phone}
            />
            {/* Mật khẩu */}
            <Input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              icon={FaLock}
              required
              autoComplete="new-password"
              onChange={handleChange}
              value={formData.password}
              error={errors.password}
            />

            {/* Xác nhận mật khẩu */}
            <Input
              type="password"
              name="confirm_password"
              placeholder="Xác nhận mật khẩu"
              icon={FaLock}
              required
              autoComplete="new-password"
              onChange={handleChange}
              value={formData.confirm_password}
              error={errors.confirm_password}
            />
          </div>

          <div className="text-sm text-gray-600">
            Bằng việc đăng ký, bạn đã đồng ý với {APP_INFO.NAME} về{" "}
            <Link to="/terms" className="text-[#0078E8] hover:underline">
              Điều khoản dịch vụ
            </Link>{" "}
            &{" "}
            <Link to="/privacy" className="text-[#0078E8] hover:underline">
              Chính sách bảo mật
            </Link>
          </div>

          <Button type="submit" fullWidth>
            Đăng ký
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Bạn đã có tài khoản {APP_INFO.NAME}?{" "}
              <Link
                to="/login"
                className="text-[#0078E8] hover:underline font-medium"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
