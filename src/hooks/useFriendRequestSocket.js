import { useEffect, useState } from "react";
import {
  getFriendRequests,
  getSentFriendRequests,
} from "../services/friendService";

export const useFriendRequestSocket = (socket, userID) => {
  const [requestList, setRequestList] = useState([]);
  const fetchRequestList = async () => {
    try {
      const results = await getFriendRequests();
      setRequestList(results);
    } catch (error) {
      console.log(error);
      if (error.response.data.statusCode === 404) {
        setRequestList([]);
      }
    }
  };

  const [sentRequestList, setSentRequestList] = useState([]);
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

  useEffect(() => {
    if (!socket || !userID) return;

    const handleFiendRequest = () => {
      fetchRequestList();
    };
    fetchRequestList();

    const handleSentFiendRequest = () => {
      fetchSentRequestList();
    };
    fetchSentRequestList();

    socket.on("friendRequest", handleFiendRequest);
    socket.on("sentFriendRequest", handleSentFiendRequest);
    socket.on("friendRequestAccepted", () => {
      fetchRequestList();
      fetchSentRequestList();
    });

    return () => {
      socket.off("friendRequest", handleFiendRequest);
      socket.off("sentFriendRequest", handleSentFiendRequest);
      socket.off("friendRequestAccepted", () => {
        fetchRequestList();
        fetchSentRequestList();
      });
    };
  }, [socket, userID]);
  return { requestList, sentRequestList };
};

export default useFriendRequestSocket;
