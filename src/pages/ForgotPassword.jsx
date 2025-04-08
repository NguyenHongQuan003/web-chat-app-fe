// src/pages/Register.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { FaLock, FaPhone } from "react-icons/fa";
import Button from "../components/Button";
import { APP_INFO } from "../constants/app.constants";
import { auth } from "../firebase/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast } from "react-toastify";
import OTPInput from "../components/OTPInput";
import { checkPhoneNumber, forgetPassword } from "../services/apiFunctionsUser";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    passWord: "",
    otp: "",
    confirm_password: "",
  });
  useEffect(() => {
    console.log("formData OTP", formData);
  }, [formData]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Gửi OTP
  const handleSendOTP = async () => {
    console.log("Bắt đầu gửi OTP...");

    const recaptchaContainer = document.getElementById("recaptcha-container");
    if (!recaptchaContainer) {
      console.error("Không tìm thấy #recaptcha-container trong DOM");
      return;
    }

    // Nếu reCAPTCHA đã được khởi tạo trước đó, xóa nó để tránh lỗi render trùng lặp
    if (window.recaptchaVerifier) {
      try {
        console.log("Xóa reCAPTCHA cũ...");
        window.recaptchaVerifier.clear();
      } catch (err) {
        console.warn("Không thể clear reCAPTCHA cũ:", err.message);
      }
      window.recaptchaVerifier = null;
      recaptchaContainer.innerHTML = ""; // Clear DOM
    }

    // Tạo mới reCAPTCHA
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA đã được giải", response);
          },
          "expired-callback": () => {
            console.log("reCAPTCHA hết hạn, cần khởi tạo lại");
            window.recaptchaVerifier = null;
          },
        }
      );

      await window.recaptchaVerifier.render();
      console.log("reCAPTCHA khởi tạo thành công");
    } catch (error) {
      console.error("Lỗi khởi tạo reCAPTCHA:", error.message);
      toast.error("Lỗi khi tạo reCAPTCHA, vui lòng thử lại sau");
      return;
    }

    const appVerifier = window.recaptchaVerifier;
    const phoneNumber = "+84" + formData.phoneNumber.slice(1);
    console.log("Số điện thoại:", phoneNumber);

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;

      toast.success("OTP đã được gửi thành công!");
      toast.info("Vui lòng kiểm tra số điện thoại để nhận mã OTP");

      setStep(2); // Chuyển sang bước nhập OTP
    } catch (error) {
      console.error("Không thể gửi OTP:", error.message);
      toast.error("Không thể gửi OTP: " + error.message);
    }
  };

  // Xác minh OTP
  const handleVerifyOTP = async () => {
    try {
      await window.confirmationResult.confirm(formData.otp);
      setFormData((prev) => ({ ...prev, otp: "" }));
      window.recaptchaVerifier.clear();
      // console.log("Xác minh OTP thành công! UID: " + result.user.uid);
      toast.success("Xác minh OTP thành công!");
      setStep(3);
    } catch (error) {
      console.error("Lỗi xác minh OTP:", error);
      //   setErrors((prev) => ({
      //     ...prev,
      //     otp: "Mã OTP không đúng hoặc đã hết hạn",
      //   }));
      toast.warning("Mã OTP không đúng hoặc đã hết hạn");
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
      default:
        break;
    }
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    const phoneError = validatePhone(formData.phoneNumber);
    if (!phoneError) {
      try {
        const isExists = await checkPhoneNumber(formData.phoneNumber);
        if (isExists) {
          await handleSendOTP();
        } else {
          toast.warning("Số điện thoại không tồn tại");
        }
      } catch (error) {
        console.log("Lỗi khi kiểm tra số điện thoại", error);
      }
    } else {
      setErrors((prev) => ({ ...prev, phoneNumber: phoneError }));
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    console.log("formData OTP", formData);
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

    if (!passwordError && !confirmPasswordError) {
      console.log("Registration completed:", formData);
      try {
        const response = await forgetPassword(formData);
        console.log("Du lieu tra ve tu server khi update mat khau", response);
        toast.success("Đổi mật khẩu thành công!");
        navigate("/login");
      } catch (error) {
        console.log("Loi khi update mat khau", error);
        toast.error("Lỗi khi đổi mật khẩu!");
      }
    } else {
      setErrors({
        passWord: passwordError,
        confirm_password: confirmPasswordError,
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
            <OTPInput
              length={6}
              onChangeOTP={(otp) => {
                setFormData({ ...formData, otp });
                console.log("OTP hiện tại OTP input:", otp);
                handleChange({ target: { name: "otp", value: otp } });
              }}
              error={errors.otp}
            />
            <Button
              type="submit"
              fullWidth
              disabled={errors.otp !== "" || formData.otp === "" ? true : false}
            >
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
            <Input
              type="password"
              name="passWord"
              placeholder="Mật khẩu mới"
              icon={FaLock}
              required
              onChange={handleChange}
              value={formData.passWord}
              error={errors.passWord}
            />
            <Input
              type="password"
              name="confirm_password"
              placeholder="Xác nhận mật khẩu mới"
              icon={FaLock}
              required
              onChange={handleChange}
              value={formData.confirm_password}
              error={errors.confirm_password}
            />
            <Button
              type="submit"
              fullWidth
              disabled={!!errors.passWord || !!errors.confirm_password}
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
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Quên mật khẩu
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

export default ForgotPassword;
