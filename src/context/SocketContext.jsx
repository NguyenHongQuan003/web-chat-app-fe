import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import PropTypes from "prop-types";
import { useAuth } from "../utils/authUtils";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  useEffect(() => {
    if (!user?.userID) return;

    const connectSocket = io("http://127.0.0.1:8022", {
      query: {
        userId: user.userID,
      },
    });
    connectSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    setSocket(connectSocket);

    // Cleanup khi component unmount
    return () => {
      connectSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    console.log("Socket state:", socket);
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
