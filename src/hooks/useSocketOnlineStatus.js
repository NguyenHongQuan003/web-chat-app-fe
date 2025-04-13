import { useEffect, useState } from "react";

const useSocketOnlineStatus = (socket, userID) => {
  const [onlineStatus, setOnlineStatus] = useState(false);

  useEffect(() => {
    if (!socket || !userID) return;

    const handleOnlineUsers = (users) => {
      console.log("Online users:", users);
      setOnlineStatus(users.includes(userID));
    };

    socket.on("getOnlineUsers", handleOnlineUsers);

    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
    };
  }, [socket, userID]);

  return onlineStatus;
};

export default useSocketOnlineStatus;
