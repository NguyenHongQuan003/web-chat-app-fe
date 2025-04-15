import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { hasNewMessageState } from "../recoil/hasNewMessageAtom";

const useMessageSocket = (socket, userID, messages, setMessages) => {
  const setHasNewMessage = useSetRecoilState(hasNewMessageState);
  useEffect(() => {
    if (!socket || !userID) return;

    const handleNewMessage = (data) => {
      console.log("New message received:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
      setHasNewMessage(true);
    };
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, userID, messages, setMessages, setHasNewMessage]);
};

export default useMessageSocket;
