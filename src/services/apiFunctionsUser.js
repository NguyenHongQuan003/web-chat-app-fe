import axios from "axios";
import { API_URL_8022 } from "../constants/app.constants";

// Tìm kiếm người dùng theo số điện thoại
export const searchUserByPhoneNumber = async (phoneNumber) => {
  const response = await axios.get(
    `${API_URL_8022}/users/search/${phoneNumber}`,
    { withCredentials: true }
  );
  return response.data;
};

// Lấy thông tin người dùng theo ID
export const getUserById = async (userId) => {
  const response = await axios.get(`${API_URL_8022}/users/user/${userId}`);
  return response;
};
