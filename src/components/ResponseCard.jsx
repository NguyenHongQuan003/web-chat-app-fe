import { toast } from "react-toastify";
import {
  acceptFriendRequest,
  declineFriendRequest,
} from "../services/apiFunctionFriend";
import Button from "./Button";
import PropTypes from "prop-types";

const ResponseCard = ({ infomation }) => {
  const handleAccept = async () => {
    try {
      await acceptFriendRequest(infomation?.userID);
      toast.success("Đã chấp nhận lời mời kết bạn");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecline = async () => {
    try {
      await declineFriendRequest(infomation?.userID);
      toast.success("Đã từ chối lời mời kết bạn");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md p-4 w-86 h-32">
      <div className="flex items-center gap-2">
        <img src={infomation?.avatar} className="w-12 h-12 rounded-full" />

        <h3>{infomation?.fullName}</h3>
      </div>
      <div className="flex gap-2 mt-2">
        <Button
          size="small"
          variant="outline"
          fullWidth
          onClick={handleDecline}
        >
          Từ chối
        </Button>
        <Button size="small" variant="primary" fullWidth onClick={handleAccept}>
          Đồng ý
        </Button>
      </div>
    </div>
  );
};

ResponseCard.propTypes = {
  infomation: PropTypes.object.isRequired,
};

export default ResponseCard;
