import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import ResponseCard from "./ResponseCard";
import CancelCard from "./CancelCard";
import { useAuth } from "../utils/authUtils";
import useFriendRequestSocket from "../hooks/useFriendRequestSocket";
import { useSocket } from "../context/SocketContext";

const FriendRequestList = () => {
  const { user } = useAuth();
  const socket = useSocket();

  const { requestList, sentRequestList } = useFriendRequestSocket(
    socket,
    user?.userID
  );
  console.log("requestList", requestList);
  console.log("sentRequestList", sentRequestList);
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
