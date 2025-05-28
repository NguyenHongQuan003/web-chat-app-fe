import axiosInstance from "../utils/axiosConfig";

// Function to get the conversation list http://localhost:8022/api/v1/conversations
export const getConversations = async () => {
  try {
    const response = await axiosInstance.get("/conversations");
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

// http://127.0.0.1:8022/api/v1/conversations/getReceiver/77524684-11bd-4a78-b2e5-4a151cc4f395
export const getReceiver = async (conversationID) => {
  try {
    const response = await axiosInstance.get(
      `/conversations/getReceiver/${conversationID}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching receiver:", error);
    throw error;
  }
};

// http://127.0.0.1:8022/api/v1/conversations/haveTheyChatted/77a17656-4d70-4b83-a73b-25a12cf25444
export const haveTheyChatted = async (userID) => {
  try {
    const response = await axiosInstance.get(
      `/conversations/haveTheyChatted/${userID}`
    );
    return response.data;
  } catch (error) {
    console.error("Error checking if they have chatted:", error);
    throw error;
  }
};
// /updateStateSeen/:conversationId
export const updateStateSeen = async (conversationID) => {
  try {
    const response = await axiosInstance.post(
      `/conversations/updateStateSeen/${conversationID}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating state seen:", error);
    throw error;
  }
};

// http://127.0.0.1:8022/api/v1/conversations/conversationNoSeen
export const getConversationNoSeen = async () => {
  try {
    const response = await axiosInstance.get(
      "/conversations/conversationNoSeen"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations with no seen state:", error);
    throw error;
  }
};
