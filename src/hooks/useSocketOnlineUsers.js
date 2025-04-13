import { useEffect, useState } from "react";

const useSocketOnlineUsers = (socket) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  return onlineUsers;
};

export default useSocketOnlineUsers;
