import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../utils/authUtils";
import PropTypes from "prop-types";
import { infoChatVideoState, statusOfCallVideo } from "../recoil/leftPanelAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { getUserById } from "../services/userService";
import {
  BsMic,
  BsMicMute,
  BsCameraVideo,
  BsCameraVideoOff,
  BsTelephoneX,
} from "react-icons/bs";

const VideoCallModal = ({ isOpen, onClose }) => {
  const socket = useSocket();
  const { user } = useAuth();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [caller, setCaller] = useState(null);
  const [offer, setOffer] = useState(null);
  const toReceiver = useRecoilValue(infoChatVideoState);
  const [callStatus, setCallStatus] = useRecoilState(statusOfCallVideo);
  const [callerInfo, setCallerInfo] = useState(null);
  const [peerUserInfo, setPeerUserInfo] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    if (callStatus === "idle" && toReceiver?.receiver) {
      setPeerUserInfo(toReceiver.receiver);
    }
  }, [callStatus, toReceiver]);

  useEffect(() => {
    if (callStatus === "receiving" && callerInfo) {
      setPeerUserInfo(callerInfo);
    }
  }, [callStatus, callerInfo]);

  useEffect(() => {
    if (!isOpen) {
      // Cleanup khi đóng modal
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      setCallStatus("idle");
      setCaller(null);
      setOffer(null);
      setLocalStream(null);
    }
  }, [isOpen, setCallStatus, localStream]);

  useEffect(() => {
    if (!socket) return;

    // Lắng nghe sự kiện incoming-call
    socket.on("incoming-call", ({ from, offer }) => {
      setCaller(from);
      setOffer(offer);
      setCallStatus("receiving");
      const fetchCallerInfo = async () => {
        try {
          const userInfo = await getUserById(from);
          setCallerInfo(userInfo.data);
        } catch (error) {
          console.error("Không thể lấy thông tin người gọi:", error);
        }
      };
      fetchCallerInfo();
    });

    // Lắng nghe sự kiện call-answered
    socket.on("call-answered", ({ from, answer }) => {
      console.log("Call answered by:", from);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
      setCallStatus("connected");
    });

    // Lắng nghe sự kiện ice-candidate
    socket.on("ice-candidate", ({ from, candidate }) => {
      console.log("Received ICE candidate from:", from);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    });

    // Lắng nghe sự kiện call-ended
    socket.on("call-ended", ({ from }) => {
      console.log("Call ended by:", from);
      endCall();
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-answered");
      socket.off("ice-candidate");
      socket.off("call-ended");
    };
  }, [socket, setCallStatus]);

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      localVideoRef.current.srcObject = stream;

      const configuration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      };

      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Thêm local stream vào peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Xử lý ICE candidate
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            targetUserId: toReceiver?.receiver?.userID,
            candidate: event.candidate,
          });
        }
      };

      // Xử lý remote stream
      peerConnection.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      // Tạo và gửi offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket.emit("call-user", {
        targetUserId: toReceiver?.receiver?.userID,
        offer: offer,
      });

      setCallStatus("calling");
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus("error");
    }
  };

  const answerCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      localVideoRef.current.srcObject = stream;

      const configuration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      };

      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Thêm local stream vào peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Xử lý ICE candidate
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            targetUserId: caller,
            candidate: event.candidate,
          });
        }
      };

      // Xử lý remote stream
      peerConnection.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      // Set remote description và tạo answer
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.emit("answer-call", {
        targetUserId: caller,
        answer: answer,
      });

      setCallStatus("connected");
    } catch (error) {
      console.error("Error answering call:", error);
      setCallStatus("error");
    }
  };

  const endCall = () => {
    // Gửi sự kiện end-call đến người dùng khác
    if (callStatus === "connected" || callStatus === "calling") {
      const targetUserId =
        callStatus === "connected"
          ? caller || toReceiver?.receiver?.userID
          : toReceiver?.receiver?.userID;

      if (targetUserId) {
        socket.emit("end-call", { targetUserId });
      }
    }

    // Cleanup
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-[1000px] h-[700px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {callStatus === "calling"
              ? "Đang gọi..."
              : callStatus === "receiving"
              ? "Cuộc gọi đến"
              : callStatus === "connected"
              ? "Đang kết nối"
              : "Cuộc gọi video"}
          </h2>
          <button
            onClick={endCall}
            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
          >
            <BsTelephoneX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 relative">
          <div className="relative rounded-xl overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 text-white px-3 py-2 rounded-full">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={user?.avatar || ""}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>Bạn</span>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover bg-gray-800"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 text-white px-3 py-2 rounded-full">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={peerUserInfo?.avatar || ""}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>{peerUserInfo?.fullName || "Đối phương"}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-6">
          {callStatus === "idle" && (
            <button
              onClick={startCall}
              className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Bắt đầu cuộc gọi
            </button>
          )}
          {callStatus === "receiving" && (
            <button
              onClick={answerCall}
              className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Trả lời
            </button>
          )}
          {callStatus === "calling" && (
            <div className="text-center">
              <div className="animate-pulse text-gray-400">
                Đang đợi người dùng trả lời...
              </div>
            </div>
          )}
          {callStatus === "connected" && (
            <div className="flex gap-4">
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full ${
                  isMuted ? "bg-red-500" : "bg-gray-700"
                } text-white hover:opacity-80 transition-colors duration-200`}
              >
                {isMuted ? (
                  <BsMicMute className="w-6 h-6" />
                ) : (
                  <BsMic className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full ${
                  isVideoOff ? "bg-red-500" : "bg-gray-700"
                } text-white hover:opacity-80 transition-colors duration-200`}
              >
                {isVideoOff ? (
                  <BsCameraVideoOff className="w-6 h-6" />
                ) : (
                  <BsCameraVideo className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={endCall}
                className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
              >
                <BsTelephoneX className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

VideoCallModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VideoCallModal;
