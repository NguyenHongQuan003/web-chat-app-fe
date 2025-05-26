import { useEffect } from "react";
import { getConversations } from "../services/conversationService";
import { useRecoilState } from "recoil";
import { conversationListState } from "../recoil/conversationAtom";

const useConversationSocket = (socket, userID) => {
  const [conversationList, setConversationList] = useRecoilState(
    conversationListState
  );

  useEffect(() => {
    if (!socket || !userID) return;
    const fetchConversationList = async () => {
      try {
        const results = await getConversations();
        setConversationList(results);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    const handleGetConversationList = () => {
      fetchConversationList();
    };
    fetchConversationList();

    socket.on("notification", handleGetConversationList);
    socket.on("memberKicked", handleGetConversationList);

    return () => {
      socket.off("notification", handleGetConversationList);
      socket.off("memberKicked", handleGetConversationList);
    };
  }, [socket, userID, setConversationList]);
  return conversationList;
};

export default useConversationSocket;
