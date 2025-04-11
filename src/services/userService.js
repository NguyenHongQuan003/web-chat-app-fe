import axiosInstance from "../utils/axiosConfig";

export const searchUserByPhoneNumber = async (phoneNumber) => {
  const response = await axiosInstance.get(`/users/search/${phoneNumber}`);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/users/user/${userId}`);
  return response;
};

export const forgetPassword = async (data) => {
  const dataUpdate = {
    phoneNumber: data.phoneNumber,
    newPassWord: data.passWord,
    reNewPassWord: data.confirm_password,
  };
  try {
    const response = await axiosInstance.put(
      "/users/forget-password",
      dataUpdate
    );
    return response.status === 200;
  } catch (error) {
    if (error.response.status === 404) {
      return false;
    }
    throw error;
  }
};

// Kiểm tra số điện thoại có tồn tại
export const checkPhoneNumber = async (phoneNumber) => {
  try {
    const response = await axiosInstance.get(
      `/users/checkPhoneNumber/${phoneNumber}`
    );
    return response.status === 200;
  } catch (error) {
    if (error.response.status === 404) {
      return false;
    }
    throw error;
  }
};

export const updateAvatarUser = async (formData) => {
  const userData = new FormData();
  userData.append("avatar", formData.avatar);

  const response = await axiosInstance.put("/users/update", userData);
  return response.data;
};

export const updateProfileUser = async (formData) => {
  const userData = new FormData();
  userData.append("fullName", formData.fullName);
  userData.append("gender", formData.gender);
  userData.append("dayOfBirth", formData.dayOfBirth);

  const response = await axiosInstance.put("/users/update", userData);
  return response.data;
};
