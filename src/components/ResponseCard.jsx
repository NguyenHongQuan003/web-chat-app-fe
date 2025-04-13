import { toast } from "react-toastify";
import {
  acceptFriendRequest,
  declineFriendRequest,
} from "../services/friendService";
import PropTypes from "prop-types";
import Loading from "./Loading";
import { useState } from "react";

const ResponseCard = ({ infomation }) => {
  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [isLoadingDecline, setIsLoadingDecline] = useState(false);

  const handleAccept = async () => {
    setIsLoadingAccept(true);
    try {
      await acceptFriendRequest(infomation?.userID);
      toast.success("Đã chấp nhận lời mời kết bạn");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingAccept(false);
    }
  };

  const handleDecline = async () => {
    setIsLoadingDecline(true);
    try {
      await declineFriendRequest(infomation?.userID);
      toast.success("Đã từ chối lời mời kết bạn");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingDecline(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md p-4 w-86 h-32">
      <div className="flex items-center gap-2">
        <img src={infomation?.avatar} className="w-12 h-12 rounded-full" />

        <h3>{infomation?.fullName}</h3>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleDecline}
          disabled={isLoadingDecline}
          className="w-full rounded-lg border-2 border-[#0078E8] text-[#0078E8] hover:bg-[#0078E8]/10 focus:ring-[#0078E8] px-3 py-1.5 text-sm"
        >
          {isLoadingDecline ? (
            <div className="flex items-center justify-center gap-2">
              <Loading size="sm" />
              <span>Đang xử lý...</span>
            </div>
          ) : (
            "Từ chối"
          )}
        </button>
        <button
          onClick={handleAccept}
          disabled={isLoadingAccept}
          className="w-full rounded-lg bg-[#0078E8] text-white hover:bg-[#0066CC] focus:ring-[#0078E8] px-3 py-1.5 text-sm"
        >
          {isLoadingAccept ? (
            <div className="flex items-center justify-center gap-2">
              <Loading size="sm" />
              <span>Đang xử lý...</span>
            </div>
          ) : (
            "Đồng ý"
          )}
        </button>
      </div>
    </div>
  );
};

ResponseCard.propTypes = {
  infomation: PropTypes.object.isRequired,
};

export default ResponseCard;
