import axiosInstance from "../utils/axiosConfig";

// Tìm kiếm người dùng theo số điện thoại
// export const searchUserByPhoneNumber = async (phoneNumber) => {
//   const response = await axios.get(
//     `${API_URL_8022}/users/search/${phoneNumber}`,
//     { withCredentials: true }
//   );
//   return response.data;
// };
export const searchUserByPhoneNumber = async (phoneNumber) => {
  const response = await axiosInstance.get(`/users/search/${phoneNumber}`);
  return response.data;
};

// Lấy thông tin người dùng theo ID
// export const getUserById = async (userId) => {
//   const response = await axios.get(`${API_URL_8022}/users/user/${userId}`, {
//     withCredentials: true,
//   });
//   return response;
// };
export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/users/user/${userId}`);
  return response;
};

// Forgot Password
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
