import { useEffect } from "react";
import { incomingCallState } from "../recoil/leftPanelAtom";
import { useSetRecoilState } from "recoil";

const useInComingCall = (socket, userID) => {
  const setInComingCall = useSetRecoilState(incomingCallState);
  useEffect(() => {
    if (!socket || !userID) return;

    socket.on("incoming-call", ({ from, offer }) => {
      setInComingCall({ from, offer });
    });
    socket.on("call-ended", () => {
      console.log("Call ended by the other user");
      setInComingCall(null);
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-ended");
    };
  }, [socket, userID, setInComingCall]);
};

export default useInComingCall;
