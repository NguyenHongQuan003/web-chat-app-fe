import axios from "axios";
import { API_URL_8022 } from "../constants/app.constants";

// Gửi lời mời kết bạn
export const sendFriendRequest = async (receiverId) => {
  const response = await axios.post(`${API_URL_8022}/friends/`, {
    receiverId,
  });
  return response.data;
};

// Hủy lời mời kết bạn
export const cancelFriendRequest = async (receiverId) => {
  const response = await axios.delete(
    `${API_URL_8022}/friends/${receiverId}/cancel`
  );
  return response.data;
};

// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = async (senderId) => {
  const response = await axios.get(
    `${API_URL_8022}/friends/${senderId}/accept`
  );
  return response.data;
};

// Từ chối lời mời kết bạn
export const declineFriendRequest = async (senderId) => {
  const response = await axios.get(
    `${API_URL_8022}/friends/${senderId}/decline`
  );
  return response.data;
};

// Lấy danh sách lời mời kết bạn
export const getFriendRequests = async () => {
  const response = await axios.get(`${API_URL_8022}/friends/requests`);
  return response.data;
};

// Lấy danh sách lời mời kết bạn đã gửi
export const getSentFriendRequests = async () => {
  const response = await axios.get(`${API_URL_8022}/friends/requests/sent`);
  return response.data;
};
