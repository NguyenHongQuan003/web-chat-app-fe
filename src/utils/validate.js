export const validatePhone = (phoneNumber) => {
  const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phoneNumber)
    ? ""
    : "Bắt đầu bằng 03|05|07|08|09 và có 10 số";
};

export const validateFullName = (fullName) => {
  if (!fullName.trim()) {
    return "Họ tên không được để trống";
  }

  const nameRegex = /^[A-Za-zÀ-Ỹà-ỹ0-9\s]+$/;

  if (!nameRegex.test(fullName)) {
    return "Chỉ được chứa chữ cái, chữ số và dấu cách (không chứa số hoặc ký tự đặc biệt)";
  }

  return "";
};

export const validateOTP = (otp) => {
  return otp.length === 6 ? "" : "Mã OTP phải có 6 chữ số";
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return "Phải có ít nhất 6 ký tự";
  }
  if (!/[A-Z]/.test(password)) {
    return "Phải có ít nhất 1 chữ cái viết hoa";
  }
  if (!/[a-z]/.test(password)) {
    return "Phải có ít nhất 1 chữ cái viết thường";
  }
  if (!/[0-9]/.test(password)) {
    return "Phải có ít nhất 1 chữ số";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Phải chứa ít nhất 1 ký tự đặc biệt (ví dụ: !, @, #, $, %...)";
  }
  return "";
};

export const validateConfirmPassword = (confirm_password, password) => {
  return confirm_password === password ? "" : "Mật khẩu không khớp";
};

export const validateDayOfBirth = (dayOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dayOfBirth);

  const age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  const actualAge = hasHadBirthdayThisYear ? age : age - 1;

  return actualAge >= 18 ? "" : "Người dùng phải đủ 18 tuổi trở lên";
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const formatDateToVietnamese = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day} tháng ${month}, ${year}`;
};
