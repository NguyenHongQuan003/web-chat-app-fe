import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { hasNewMessageState } from "../recoil/hasNewMessageAtom";
import { getMessagesByConversation } from "../services/messageService";
import { typeContentState } from "../recoil/leftPanelAtom";

const useMessageSocket = (socket, userID, messages, setMessages) => {
  const typeContent = useRecoilValue(typeContentState);
  const setHasNewMessage = useSetRecoilState(hasNewMessageState);
  useEffect(() => {
    if (!socket || !userID) return;

    const handleNewMessage = (data) => {
      console.log("New message received:", data);
      const fetchedMessages = async () => {
        try {
          const conversationID =
            typeContent.conversation.conversation.conversationID;
          const fetchedMessages = await getMessagesByConversation(
            conversationID
          );
          const sortedMessages = fetchedMessages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          setMessages(sortedMessages);
        } catch {
          setMessages([]);
        }
      };
      fetchedMessages();
      setHasNewMessage(true);
    };
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, userID, messages, setMessages, setHasNewMessage, typeContent]);
};

export default useMessageSocket;
