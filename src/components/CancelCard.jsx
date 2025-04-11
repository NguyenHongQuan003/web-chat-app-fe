import { toast } from "react-toastify";
import Button from "./Button";
import PropTypes from "prop-types";
import { cancelFriendRequest } from "../services/friendService";

const CancelCard = ({ infomation }) => {
  const handleCancel = async () => {
    try {
      const res = await cancelFriendRequest(infomation?.userID);
      console.log("handleCancel", res);
      toast.success("Đã hủy yêu cầu");
    } catch (error) {
      console.log("handleCancel", error);
    }
  };
  return (
    <div className="bg-white border border-gray-300 rounded-md p-4 w-86 h-32">
      <div className="flex items-center gap-2">
        <img src={infomation?.avatar} className="w-12 h-12 rounded-full" />

        <h3>{infomation?.fullName}</h3>
      </div>
      <div className="flex gap-2 mt-2" onClick={handleCancel}>
        <Button size="small" variant="primary" fullWidth>
          Hủy lời mời
        </Button>
      </div>
    </div>
  );
};

CancelCard.propTypes = {
  infomation: PropTypes.object.isRequired,
};

export default CancelCard;
