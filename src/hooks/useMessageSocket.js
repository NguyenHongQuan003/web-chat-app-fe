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
          let conversationID =
            typeContent?.conversation?.conversation?.conversationID;
          console.log("conversationID", conversationID);
          console.log("data.conversationID", data?.conversationID);
          if (conversationID === undefined || conversationID === null) {
            console.log(
              "conversationID is undefined or null, using data.conversationID"
            );
            conversationID = data.conversationID;
          }
          const fetchedMessages = await getMessagesByConversation(
            conversationID
          );
          const sortedMessages = fetchedMessages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          // if (
          //   data.conversationID ===
          //   typeContent.conversation.conversation.conversationID
          // ) {
          setMessages(sortedMessages);
          // }
        } catch {
          setMessages([]);
        }
      };
      fetchedMessages();
      setHasNewMessage(true);
    };
    socket.on("newMessage", handleNewMessage);
    socket.on("newMessageGroup", handleNewMessage);
    socket.on("revokeMessage", handleNewMessage);
    socket.on("revokeMessageGroup", handleNewMessage);
    socket.on("deleteMessage", handleNewMessage);
    socket.on("deleteMessageGroup", handleNewMessage);
    socket.on("memberKicked", handleNewMessage);
    socket.on("newMember", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newMessageGroup", handleNewMessage);
      socket.off("revokeMessage", handleNewMessage);
      socket.off("revokeMessageGroup", handleNewMessage);
      socket.off("deleteMessage", handleNewMessage);
      socket.off("deleteMessageGroup", handleNewMessage);
      socket.off("memberKicked", handleNewMessage);
      socket.off("newMember", handleNewMessage);
    };
  }, [socket, userID, messages, setMessages, setHasNewMessage, typeContent]);
};

export default useMessageSocket;
