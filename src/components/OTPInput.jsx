import PropTypes from "prop-types";
import { useRef } from "react";

const OTPInput = ({ length = 6, onChangeOTP, error }) => {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    let value = e.target.value;

    // Nếu không phải là số, xóa ký tự và return
    if (!/^\d$/.test(value)) {
      e.target.value = ""; // Xóa ký tự không hợp lệ
      return;
    }

    // Gán giá trị (chỉ giữ 1 chữ số)
    e.target.value = value;

    // Cập nhật OTP
    const otp = inputsRef.current.map((input) => input.value).join("");
    onChangeOTP(otp);

    // Di chuyển sang ô tiếp theo nếu còn
    if (index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
    // Cập nhật OTP khi xoá
    setTimeout(() => {
      const otp = inputsRef.current.map((input) => input.value || "").join("");
      onChangeOTP(otp);
    }, 0);
  };

  return (
    <>
      <div className="flex justify-center gap-2">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center text-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </>
  );
};

OTPInput.propTypes = {
  length: PropTypes.number,
  onChangeOTP: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default OTPInput;
