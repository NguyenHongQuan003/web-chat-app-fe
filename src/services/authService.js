import axios from "axios";
const API_URL = "http://localhost:8022/api/v1";

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      withCredentials: true,
    });
    // console.log(
    //   "Du lieu tra ve tu server khi lay thong tin user",
    //   response.data
    // );
    return response.data;
  } catch (error) {
    throw new Error("Failed to get current user", error);
  }
};

export const register = async (formData) => {
  const userData = new FormData();
  userData.append("phoneNumber", formData.phoneNumber);
  userData.append("fullName", formData.fullName);
  userData.append("passWord", formData.passWord);
  userData.append("avatar", formData.avatar);
  userData.append("gender", formData.gender);
  userData.append("dayOfBirth", formData.dayOfBirth);
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    console.log("Du lieu tra ve tu server khi dang ky", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to register user", error);
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, userData, {
      withCredentials: true,
    });
    console.log("Du lieu tra ve tu server khi dang nhap", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to login user", error);
  }
};

export const logout = async () => {
  try {
    const result = await axios.post(
      `${API_URL}/users/logout`,
      {},
      { withCredentials: true }
    );
    console.log("Dang xuat thanh cong", result);
  } catch (error) {
    throw new Error("Failed to logout user", error);
  }
};
