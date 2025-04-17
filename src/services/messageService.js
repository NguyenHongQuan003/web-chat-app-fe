import axiosInstance from "../utils/axiosConfig";

export const sendTextMessage = async (receiverId, message) => {
  const response = await axiosInstance.post(`/messages/send/${receiverId}`, {
    message,
  });
  return response.data;
};

export const sendFiles = async (receiverId, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axiosInstance.post(
    `/messages/send/files/${receiverId}`,
    formData
  );
  return response.data;
};

// Thu hồi tin nhắn
export const revokeMessage = async (
  participantId,
  messageID,
  conversationID
) => {
  const response = await axiosInstance.post(
    `/messages/revoke/${participantId}`,
    {
      messageID,
      conversationID,
    }
  );
  return response.data;
};

export const deleteMessage = async (messageID, conversationID) => {
  const response = await axiosInstance.post("/messages/delete", {
    messageID,
    conversationID,
  });
  return response.data;
};

export const shareMessage = async (messageID, receiverIds, conversationID) => {
  console.log("messageID", messageID);
  console.log("receiverIds", receiverIds);
  const response = await axiosInstance.post("/messages/share", {
    messageID,
    receiverIds,
    conversationID,
  });
  return response.data;
};

export const getMessagesByConversation = async (conversationID) => {
  const response = await axiosInstance.get(
    `/messages/conversation/${conversationID}`
  );
  return response.data;
};
