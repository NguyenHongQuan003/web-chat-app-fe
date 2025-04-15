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
