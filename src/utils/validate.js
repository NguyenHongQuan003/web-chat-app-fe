export const validatePhone = (phoneNumber) => {
  const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phoneNumber) ? "" : "Bắt đầu bằng 0 và có 10 số";
};

export const validateOTP = (otp) => {
  return otp.length === 6 ? "" : "Mã OTP phải có 6 chữ số";
};

export const validatePassword = (passWord) => {
  return passWord.length >= 8 ? "" : "Mật khẩu phải có ít nhất 8 ký tự";
};

export const validateConfirmPassword = (confirm_password, password) => {
  return confirm_password === password ? "" : "Mật khẩu không khớp";
};

export const validateDayOfBirth = (dayOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dayOfBirth);
  return birthDate < today ? "" : "Ngày sinh phải nhỏ hơn ngày hiện tại";
};
