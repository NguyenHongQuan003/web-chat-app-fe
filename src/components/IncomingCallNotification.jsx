import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { BsTelephoneX, BsTelephone } from "react-icons/bs";
import { getUserById } from "../services/userService";
import { useSocket } from "../context/SocketContext";

const IncomingCallNotification = ({ callerID, onAnswer, onReject }) => {
  const [caller, setCaller] = useState(null);
  const [isRinging, setIsRinging] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    if (!callerID) return;

    const fetchInfoCaller = async () => {
      try {
        const infoCaller = await getUserById(callerID);
        setCaller(infoCaller.data);
      } catch (error) {
        console.error("Error fetching caller info:", error);
      }
    };

    fetchInfoCaller();

    // Tạo hiệu ứng rung
    const ringInterval = setInterval(() => {
      setIsRinging((prev) => !prev);
    }, 1000);

    return () => clearInterval(ringInterval);
  }, [callerID]);

  const handleAnswer = () => {
    onAnswer();
  };

  const handleReject = () => {
    onReject();
    socket.emit("end-call", { targetUserId: callerID });
  };

  if (!callerID) return null;

  return (
    <div className="fixed top-4 right-4 bg-white rounded-2xl shadow-2xl p-6 w-96 z-50 animate-slide-in">
      <div className="flex flex-col items-center">
        <div
          className={`w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4 transition-transform duration-300 ${
            isRinging ? "scale-110" : "scale-100"
          }`}
        >
          <img
            src={caller?.avatar || ""}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-1">
            {caller?.fullName || "Người gọi"}
          </h3>
          <p className="text-gray-500 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Cuộc gọi video đến...
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleReject}
            className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <BsTelephoneX className="w-6 h-6" />
          </button>
          <button
            onClick={handleAnswer}
            className="p-4 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <BsTelephone className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

IncomingCallNotification.propTypes = {
  callerID: PropTypes.string.isRequired,
  onAnswer: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

export default IncomingCallNotification;
