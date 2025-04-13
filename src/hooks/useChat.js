import { useCallback } from "react";
import { useSocket } from "../context/SocketContext";

export const useChat = () => {
  const socket = useSocket();

  const sendMessage = useCallback(
    (message, roomId) => {
      if (socket) {
        socket.emit("send_message", { message, roomId });
      }
    },
    [socket]
  );

  const joinRoom = useCallback(
    (roomId) => {
      if (socket) {
        socket.emit("join_room", roomId);
      }
    },
    [socket]
  );

  const leaveRoom = useCallback(
    (roomId) => {
      if (socket) {
        socket.emit("leave_room", roomId);
      }
    },
    [socket]
  );

  const onMessageReceived = useCallback(
    (callback) => {
      if (socket) {
        socket.on("receive_message", callback);
      }
    },
    [socket]
  );

  const onUserJoined = useCallback(
    (callback) => {
      if (socket) {
        socket.on("user_joined", callback);
      }
    },
    [socket]
  );

  const onUserLeft = useCallback(
    (callback) => {
      if (socket) {
        socket.on("user_left", callback);
      }
    },
    [socket]
  );

  return {
    sendMessage,
    joinRoom,
    leaveRoom,
    onMessageReceived,
    onUserJoined,
    onUserLeft,
  };
};
