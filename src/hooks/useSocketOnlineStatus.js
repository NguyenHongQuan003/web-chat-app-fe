import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { onlineUsersState } from "../recoil/onlineUsersAtom";

const useSocketOnlineStatus = (socket, userID) => {
  const [onlineStatus, setOnlineStatus] = useState(false);
  const setOnlineUsers = useSetRecoilState(onlineUsersState);

  useEffect(() => {
    if (!socket || !userID) return;

    const handleOnlineUsers = (users) => {
      console.log("Online users:", users);
      setOnlineUsers(users);
      setOnlineStatus(users.includes(userID));
    };

    socket.on("getOnlineUsers", handleOnlineUsers);

    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
    };
  }, [socket, userID, setOnlineUsers]);

  return onlineStatus;
};

export default useSocketOnlineStatus;
