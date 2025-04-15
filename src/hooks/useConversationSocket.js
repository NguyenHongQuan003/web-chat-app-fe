import { useEffect } from "react";
import { getConversations } from "../services/conversationService";
import { useRecoilState } from "recoil";
import { conversationListState } from "../recoil/conversationAtom";

const useConversationSocket = (socket, userID) => {
  const [conversationList, setConversationList] = useRecoilState(
    conversationListState
  );

  const fetchConversationList = async () => {
    try {
      const results = await getConversations();
      setConversationList(results);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    if (!socket || !userID) return;

    const handleGetConversationList = () => {
      fetchConversationList();
    };
    fetchConversationList();

    socket.on("notification", handleGetConversationList);
    // socket.on("newMessage", (data) => {
    //   console.log("New message received:", data);
    // });

    return () => {
      socket.off("notification", handleGetConversationList);
      // socket.off("newMessage", (data) => {
      //   console.log("New message received:", data);
      // });
    };
  }, [socket, userID]);
  return conversationList;
};

export default useConversationSocket;
