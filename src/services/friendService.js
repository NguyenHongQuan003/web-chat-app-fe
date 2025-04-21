import axiosInstance from "../utils/axiosConfig";

export const sendFriendRequest = async (receiverId) => {
  const response = await axiosInstance.post(`/friends/${receiverId}`);
  return response.data;
};

export const cancelFriendRequest = async (receiverId) => {
  const response = await axiosInstance.get(`/friends/${receiverId}/cancel`);
  console.log("cancelFriendRequest", response);
  return response.data;
};

export const acceptFriendRequest = async (senderId) => {
  const response = await axiosInstance.get(`/friends/${senderId}/accept`);
  return response.data;
};

export const declineFriendRequest = async (senderId) => {
  const response = await axiosInstance.get(`/friends/${senderId}/decline`);
  return response.data;
};

export const getFriendRequests = async () => {
  const response = await axiosInstance.get(`/friends/requests`);
  return response.data;
};

export const getSentFriendRequests = async () => {
  const response = await axiosInstance.get(`/friends/requests/sent`);
  return response.data;
};

export const getFriendList = async () => {
  const response = await axiosInstance.get(`/friends`);
  // console.log("getFriendList", response);
  return response.data;
};

export const deleteFriend = async (friendId) => {
  console.log("deleteFriend", friendId);
  const response = await axiosInstance.get(`/friends/remove/${friendId}`);
  return response.data;
};
