// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import { FaLock, FaPhone, FaUser } from "react-icons/fa";
import Button from "../components/common/Button";
import { APP_INFO } from "../constants/app.constants";
import { auth } from "../firebase/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { register } from "../services/authService";
import { toast } from "react-toastify";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    fullName: "",
    passWord: "",
    avatar: null,
    gender: true,
    dayOfBirth: "",
    otp: "",
    confirm_password: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Gửi OTP
  const handleSendOTP = async () => {
    // Khởi tạo reCAPTCHA ngay trước khi gửi OTP
    console.log("auth", auth);
    console.log("Bắt đầu gửi OTP...");
    const recaptchaContainer = document.getElementById("recaptcha-container");
    if (!recaptchaContainer) {
      console.error("Không tìm thấy #recaptcha-container trong DOM");
      console.error("Lỗi: Container reCAPTCHA không tồn tại");
      return;
    }

    if (window.recaptchaVerifier) {
      console.log("Xóa reCAPTCHA cũ...");
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
      recaptchaContainer.innerHTML = "";
    }
    // Khởi tạo reCAPTCHA nếu chưa tồn tại
    if (!window.recaptchaVerifier) {
      console.log("Bắt đầu khởi tạo reCAPTCHA...");
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {
              console.log("reCAPTCHA đã được giải");
            },
            "expired-callback": () => {
              console.log("reCAPTCHA đã hết hạn");
              window.recaptchaVerifier = null;
            },
          }
        );
      } catch (error) {
        console.error("Lỗi khởi tạo reCAPTCHA:", error);
        console.error("Không thể khởi tạo reCAPTCHA: " + error.message);
        return;
      }
    }
    await window.recaptchaVerifier.render();
    console.log("reCAPTCHA khởi tạo thành công:", window.recaptchaVerifier);

    const appVerifier = window.recaptchaVerifier;
    if (!appVerifier) {
      console.error("appVerifier vẫn undefined sau khi khởi tạo");
      return;
    }
    const phoneNumber = "+84" + formData.phoneNumber.slice(1);
    console.log("Số điện thoại:", phoneNumber);

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      console.log("OTP đã được gửi thành công!");
      toast.success("OTP đã được gửi thành công!");
      console.log("Vui lòng kiểm tra số điện thoại để nhận mã OTP");
      toast.info("Vui lòng kiểm tra số điện thoại để nhận mã OTP");
      setStep(2);
    } catch (error) {
      console.error("Không thể gửi OTP: " + error.message);
      toast.error("Không thể gửi OTP: " + error.message);
    }
  };
  // Xác minh OTP
  const handleVerifyOTP = async () => {
    try {
      await window.confirmationResult.confirm(formData.otp);
      // console.log("Xác minh OTP thành công! UID: " + result.user.uid);
      toast.success("Xác minh OTP thành công!");
      setStep(3);
    } catch (error) {
      console.error("Lỗi xác minh OTP:", error);
      setErrors((prev) => ({
        ...prev,
        otp: "Mã OTP không đúng hoặc đã hết hạn",
      }));
    }
  };

  // Validation functions
  const validatePhone = (phoneNumber) => {
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    return phoneRegex.test(phoneNumber) ? "" : "Số điện thoại không hợp lệ";
  };

  const validateOTP = (otp) => {
    return otp.length === 6 ? "" : "Mã OTP phải có 6 chữ số";
  };

  const validatePassword = (passWord) => {
    return passWord.length >= 6 ? "" : "Mật khẩu phải có ít nhất 6 ký tự";
  };

  const validateConfirmPassword = (confirm_password) => {
    return confirm_password === formData.passWord ? "" : "Mật khẩu không khớp";
  };

  const validateDayOfBirth = (dayOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dayOfBirth);
    return birthDate < today ? "" : "Ngày sinh không hợp lệ";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "phoneNumber":
        setErrors((prev) => ({ ...prev, phoneNumber: validatePhone(value) }));
        break;
      case "otp":
        setErrors((prev) => ({ ...prev, otp: validateOTP(value) }));
        break;
      case "passWord":
        setErrors((prev) => ({
          ...prev,
          confirm_password: validateConfirmPassword(value),
        }));
        setErrors((prev) => ({ ...prev, passWord: validatePassword(value) }));
        break;
      case "confirm_password":
        setErrors((prev) => ({
          ...prev,
          confirm_password: validateConfirmPassword(value),
        }));
        break;
      case "dayOfBirth":
        setErrors((prev) => ({
          ...prev,
          dayOfBirth: validateDayOfBirth(value),
        }));
        break;
      default:
        break;
    }
  };

  const handleAvatarChange = (e) => {
    const selectedFile = e.target.files[0];
    setFormData((prev) => ({ ...prev, avatar: selectedFile }));
    setAvatarPreview(URL.createObjectURL(selectedFile));
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    const phoneError = validatePhone(formData.phoneNumber);
    if (!phoneError) {
      await handleSendOTP();
    } else {
      setErrors((prev) => ({ ...prev, phoneNumber: phoneError }));
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    const otpError = validateOTP(formData.otp);
    if (!otpError) {
      await handleVerifyOTP();
    } else {
      setErrors((prev) => ({ ...prev, otp: otpError }));
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(formData.passWord);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirm_password
    );
    const dayOfBirthError = validateDayOfBirth(formData.dayOfBirth);

    if (!passwordError && !confirmPasswordError && !dayOfBirthError) {
      console.log("Registration completed:", formData);
      try {
        const response = await register(formData);
        console.log("Du lieu tra ve tu server khi dang ky", response);
        toast.success("Đăng ký thành công!");
        navigate("/login");
      } catch (error) {
        console.log("Loi khi dang ky", error);
        toast.error("Số điện thoại đã tồn tại!");
      }
    } else {
      setErrors({
        passWord: passwordError,
        confirm_password: confirmPasswordError,
        dayOfBirth: dayOfBirthError,
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleStep1Submit} className="mt-8 space-y-6">
            <Input
              type="tel"
              name="phoneNumber"
              placeholder="Số điện thoại"
              icon={FaPhone}
              required
              onChange={handleChange}
              value={formData.phoneNumber}
              error={errors.phoneNumber}
            />
            <div id="recaptcha-container"></div>{" "}
            {/* Thêm container cho reCAPTCHA */}
            <Button type="submit" fullWidth disabled={!!errors.phoneNumber}>
              Tiếp tục
            </Button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleStep2Submit} className="mt-8 space-y-6">
            <Input
              type="text"
              name="otp"
              placeholder="Nhập mã OTP"
              required
              onChange={handleChange}
              value={formData.otp}
              error={errors.otp}
            />
            <Button type="submit" fullWidth disabled={!!errors.otp}>
              Xác nhận
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setStep(1)}
            >
              Quay lại
            </Button>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleFinalSubmit} className="mt-8 space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh đại diện
              </label>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-full object-cover mb-4 border border-gray-300"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <input
                type="file"
                name="avatar"
                required
                onChange={handleAvatarChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <Input
              type="text"
              name="fullName"
              placeholder="Tên người dùng"
              icon={FaUser}
              required
              onChange={handleChange}
              value={formData.fullName}
            />

            <div className="flex flex-row gap-x-3">
              <div className="flex items-center gap-x-3">
                <input
                  defaultChecked
                  id="gender-male"
                  name="gender"
                  type="radio"
                  className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                  onChange={handleChange}
                  value="true"
                />
                <label
                  htmlFor="gender-male"
                  className="block font-medium text-gray-600"
                >
                  Nam
                </label>
              </div>
              <div className="flex items-center gap-x-3">
                <input
                  id="gender-female"
                  name="gender"
                  type="radio"
                  className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                  onChange={handleChange}
                  value="false"
                />
                <label
                  htmlFor="gender-female"
                  className="block font-medium text-gray-600"
                >
                  Nữ
                </label>
              </div>
            </div>

            <Input
              label="Ngày sinh"
              type="date"
              name="dayOfBirth"
              placeholder="Ngày sinh"
              required
              onChange={handleChange}
              value={formData.dayOfBirth}
              error={errors.dayOfBirth}
            />
            <Input
              type="password"
              name="passWord"
              placeholder="Mật khẩu"
              icon={FaLock}
              required
              onChange={handleChange}
              value={formData.passWord}
              error={errors.passWord}
            />
            <Input
              type="password"
              name="confirm_password"
              placeholder="Xác nhận mật khẩu"
              icon={FaLock}
              required
              onChange={handleChange}
              value={formData.confirm_password}
              error={errors.confirm_password}
            />
            <Button
              type="submit"
              fullWidth
              disabled={
                !!errors.passWord ||
                !!errors.confirm_password ||
                !!errors.dayOfBirth
              }
            >
              Hoàn tất
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setStep(2)}
            >
              Quay lại
            </Button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#e8f3ff] flex flex-col items-center justify-center">
      <div className="text-center mb-4">
        <h1 className="text-[#0068ff] font-bold text-4xl">{APP_INFO.NAME}</h1>
        <h2>Đăng ký tài khoản {APP_INFO.NAME}</h2>
        <h2>để kết nối với ứng dụng {APP_INFO.NAME} Web</h2>
      </div>
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-center font-bold text-gray-900">
            Đăng ký tài khoản mới
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Bước {step} / 3
          </p>
        </div>
        {renderStep()}
        <div className="mt-6 text-center text-sm text-gray-600">
          Bạn đã có tài khoản {APP_INFO.NAME}?{" "}
          <Link
            to="/login"
            className="text-[#0078E8] hover:underline font-medium"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
