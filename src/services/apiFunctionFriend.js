import axios from "axios";
import { API_URL_8022 } from "../constants/app.constants";

// Gửi lời mời kết bạn
export const sendFriendRequest = async (receiverId) => {
  const response = await axios.post(
    `${API_URL_8022}/friends/${receiverId}`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

// Hủy lời mời kết bạn
export const cancelFriendRequest = async (receiverId) => {
  const response = await axios.get(
    `${API_URL_8022}/friends/${receiverId}/cancel`,
    { withCredentials: true }
  );
  console.log("cancelFriendRequest", response);
  return response.data;
};

// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = async (senderId) => {
  const response = await axios.get(
    `${API_URL_8022}/friends/${senderId}/accept`,
    { withCredentials: true }
  );
  return response.data;
};

// Từ chối lời mời kết bạn
export const declineFriendRequest = async (senderId) => {
  const response = await axios.get(
    `${API_URL_8022}/friends/${senderId}/decline`,
    { withCredentials: true }
  );
  return response.data;
};

// Lấy danh sách lời mời kết bạn
export const getFriendRequests = async () => {
  const response = await axios.get(`${API_URL_8022}/friends/requests`, {
    withCredentials: true,
  });
  console.log("response", response);
  return response.data;
};

// Lấy danh sách lời mời kết bạn đã gửi
export const getSentFriendRequests = async () => {
  const response = await axios.get(`${API_URL_8022}/friends/requests/sent`, {
    withCredentials: true,
  });
  return response.data;
};

// Lấy danh sách bạn bè
export const getFriendList = async () => {
  const response = await axios.get(`${API_URL_8022}/friends`, {
    withCredentials: true,
  });
  console.log("getFriendList", response);
  return response.data;
};
