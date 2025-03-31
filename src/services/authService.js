import axios from "axios";
import { API_URL_8022 } from "../constants/app.constants";

export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL_8022}/users/me`, {
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

  const response = await axios.post(`${API_URL_8022}/users/register`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_URL_8022}/users/login`, userData, {
    withCredentials: true,
  });
  return response.data;
};

export const logout = async () => {
  await axios.post(
    `${API_URL_8022}/users/logout`,
    {},
    { withCredentials: true }
  );
};

export const refreshToken = async () => {
  const response = await axios.get(`${API_URL_8022}/users/refresh-token`, {
    withCredentials: true,
  });
  return response.data;
};
