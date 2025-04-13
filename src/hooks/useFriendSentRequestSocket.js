import { useEffect, useState } from "react";
import { getSentFriendRequests } from "../services/friendService";

export const useFriendSentRequestSocket = (socket, userID) => {
  const [sentRequestList, setSentRequestList] = useState([]);

  useEffect(() => {
    if (!socket || !userID) return;

    const fetchSentRequestList = async () => {
      try {
        const results = await getSentFriendRequests();
        setSentRequestList(results);
      } catch (error) {
        console.log(error);
        if (error.response.data.statusCode === 404) {
          setSentRequestList([]);
        }
      }
    };

    const handleFiendSentRequest = (data) => {
      console.log("Friend sent request received:", data);
      fetchSentRequestList();
    };

    fetchSentRequestList();

    socket.on("friendRequest", handleFiendSentRequest);

    return () => {
      socket.off("friendRequest", handleFiendSentRequest);
    };
  }, [socket, userID]);
  return sentRequestList;
};

export default useFriendSentRequestSocket;
