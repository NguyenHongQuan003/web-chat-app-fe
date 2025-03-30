import axios from "axios";
const API_URL = "http://localhost:8022/api/v1";

export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/users/me`, {
    withCredentials: true,
  });
  return response.data;
};

export const register = async (formData) => {
  const userData = new FormData();
  userData.append("phoneNumber", formData.phoneNumber);
  userData.append("fullName", formData.fullName);
  userData.append("passWord", formData.passWord);
  userData.append("avatar", formData.avatar);
  userData.append("gender", formData.gender);
  userData.append("dayOfBirth", formData.dayOfBirth);

  const response = await axios.post(`${API_URL}/users/register`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/users/login`, userData, {
    withCredentials: true,
  });
  return response.data;
};

export const logout = async () => {
  await axios.post(`${API_URL}/users/logout`, {}, { withCredentials: true });
};

export const refreshToken = async () => {
  const response = await axios.get(`${API_URL}/users/refresh-token`, {
    withCredentials: true,
  });
  return response.data;
};
