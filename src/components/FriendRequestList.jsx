import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  getFriendRequests,
  getSentFriendRequests,
} from "../services/friendService";
import ResponseCard from "./ResponseCard";
import CancelCard from "./CancelCard";

const FriendRequestList = () => {
  // const data = [
  //   {
  //     id: "1",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "2",
  //     name: "Jane Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "3",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "4",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "5",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "6",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "7",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "8",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "9",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "10",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "11",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "12",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "13",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "14",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "15",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "16",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "17",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "18",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "19",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "20",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "21",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "22",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "23",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "24",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "25",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "26",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  //   {
  //     id: "27",
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "pending",
  //     action: "accept",
  //   },
  // ];

  const [requestList, setRequestList] = useState([]);
  const fetchRequestList = async () => {
    try {
      const results = await getFriendRequests();
      setRequestList(results);
    } catch (error) {
      console.log(error);
    }
  };

  const [sentRequestList, setSentRequestList] = useState([]);
  const fetchSentRequestList = async () => {
    try {
      const results = await getSentFriendRequests();
      setSentRequestList(results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequestList();
    fetchSentRequestList();
  }, [requestList]);

  return (
    <div className="flex-1 bg-gray-200 flex flex-col">
      <div className="bg-white border border-l-0 border-gray-300 p-4 font-[500] flex items-center">
        <FaEnvelope color="#5c6b82" className="w-6 h-6" />
        <span className="ml-2">Lời mời kết bạn</span>
      </div>
      <div className=" flex gap-4 flex-wrap p-2 overflow-y-auto h-[calc(100vh-4rem)]">
        {requestList.map((request) => (
          <ResponseCard key={request.id} infomation={request} />
        ))}
      </div>
      <div className="bg-white border border-l-0 border-gray-300 p-4 font-[500] flex items-center">
        <FaPaperPlane color="#5c6b82" className="w-6 h-6" />
        <span className="ml-2">Đã gửi yêu cầu</span>
      </div>
      <div className="flex gap-4 flex-wrap p-2 overflow-y-auto h-[calc(100vh-4rem)]">
        {sentRequestList.map((request) => (
          <CancelCard key={request.id} infomation={request} />
        ))}
      </div>
    </div>
  );
};

export default FriendRequestList;
