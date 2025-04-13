import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { cancelFriendRequest } from "../services/friendService";
import Loading from "./Loading";
import { useState } from "react";

const CancelCard = ({ infomation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const res = await cancelFriendRequest(infomation?.userID);
      console.log("handleCancel", res);
      toast.success("Đã hủy yêu cầu");
    } catch (error) {
      console.log("handleCancel", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white border border-gray-300 rounded-md p-4 w-86 h-32">
      <div className="flex items-center gap-2">
        <img src={infomation?.avatar} className="w-12 h-12 rounded-full" />

        <h3>{infomation?.fullName}</h3>
      </div>
      <div className="flex gap-2 mt-2" onClick={handleCancel}>
        <button
          disabled={isLoading}
          className="w-full rounded-lg bg-[#0078E8] text-white hover:bg-[#0066CC] focus:ring-[#0078E8] px-3 py-1.5 text-sm"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loading size="sm" />
              <span>Đang xử lý...</span>
            </div>
          ) : (
            "Hủy lời mời"
          )}
        </button>
      </div>
    </div>
  );
};

CancelCard.propTypes = {
  infomation: PropTypes.object.isRequired,
};

export default CancelCard;
