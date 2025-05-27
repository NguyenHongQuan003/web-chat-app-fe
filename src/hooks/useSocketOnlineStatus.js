import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { onlineUsersState } from "../recoil/onlineUsersAtom";

const useSocketOnlineStatus = (socket, userID) => {
  const setOnlineUsers = useSetRecoilState(onlineUsersState);

  useEffect(() => {
    if (!socket || !userID) return;

    const handleOnlineUsers = (users) => {
      // console.log("Online users:", users);
      const onlineUserSet = new Set(users);
      setOnlineUsers(onlineUserSet);
    };

    socket.on("getOnlineUsers", handleOnlineUsers);

    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
    };
  }, [socket, userID, setOnlineUsers]);
};

export default useSocketOnlineStatus;
