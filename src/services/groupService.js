import axiosInstance from "../utils/axiosConfig";

// Tạo nhóm
export const createGroup = async (groupName, members, avatarGroup) => {
  const formData = new FormData();
  formData.append("groupName", groupName);
  if (avatarGroup) {
    formData.append("avatarGroup", avatarGroup);
  }
  members.forEach((member) => {
    formData.append("members", member);
  });

  for (let [name, value] of formData.entries()) {
    console.log(`Name: ${name}, Value:`, value);
  }

  return axiosInstance.post("/groups/create", formData);
};

export const getGroupInfo = (groupID) => {
  const response = axiosInstance.get(`/groups/group/${groupID}`);
  return response;
};

export const getMembersOfGroup = (groupID) => {
  const response = axiosInstance.get(`/groups/members/${groupID}`);
  return response;
};

export const inviteGroup = async (groupID, members) => {
  console.log("inviteGroup", groupID);
  members.forEach((member) => {
    console.log("member", member);
  });
  return axiosInstance.post("/groups/invite", { groupID, members });
};

// Rời nhóm
export const leaveGroup = (groupID) => {
  return axiosInstance.post("/groups/leave", { groupID });
};

// Kích thành viên khỏi nhóm
export const kickMember = (groupID, memberID) => {
  console.log("kickMember", groupID, memberID);
  return axiosInstance.post("/groups/kick-member", { groupID, memberID });
};

// Giải tán nhóm
export const deleteGroup = (groupID) => {
  return axiosInstance.post("/groups/delete", { groupID });
};

// Cấp quyền admin
export const grantAdmin = (participantId, groupID) => {
  return axiosInstance.post("/groups/admin/grant", { participantId, groupID });
};

// Gửi tin nhắn văn bản
export const sendMessage = (message, groupID) => {
  return axiosInstance.post("/groups/messages/send", { message, groupID });
};

// Gửi tin nhắn file
export const sendFiles = (groupID, files) => {
  const formData = new FormData();
  formData.append("groupID", groupID);
  files.forEach((file) => {
    formData.append("files", file);
  });

  return axiosInstance.post("/groups/messages/send/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Thu hồi tin nhắn
export const revokeMessage = (messageID, groupID) => {
  return axiosInstance.post("/groups/messages/revoke", { messageID, groupID });
};

// Xóa tin nhắn
export const deleteMessage = (messageID, groupID) => {
  return axiosInstance.post("/groups/messages/delete", { messageID, groupID });
};

// Chia sẻ tin nhắn tới nhiều nhóm
export const shareMessage = (messageID, groupIDs) => {
  return axiosInstance.post("/groups/messages/share", { messageID, groupIDs });
};

// Lấy danh sách nhóm của người dùng
export const getMyGroups = () => {
  return axiosInstance.get("/groups/my-groups");
};

// Lấy tất cả các nhóm
export const getAllGroups = () => {
  return axiosInstance.get("/groups/all-groups");
};
