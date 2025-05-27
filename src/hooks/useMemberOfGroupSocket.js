import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { typeContentState } from "../recoil/leftPanelAtom";
import { getGroupInfo, getMembersOfGroup } from "../services/groupService";
import { toast } from "react-toastify";

const useMemberOfGroupSocket = (socket, userID, setMembers) => {
  const [typeContent, setTypeContent] = useRecoilState(typeContentState);

  useEffect(() => {
    if (!socket || !userID) return;

    const fetchMembersOfGroup = async () => {
      const conversationID =
        typeContent.conversation?.conversation?.conversationID;
      if (!conversationID) return;
      try {
        const members = await getMembersOfGroup(conversationID);
        // console.log("members", members.data);
        setMembers(members.data);
      } catch (err) {
        console.error("Lỗi khi lấy members nhóm:", err);
        setMembers([]);
      }
    };

    const handleChangeMemberOfGroup = () => {
      fetchMembersOfGroup();
    };
    fetchMembersOfGroup();

    const handleKickedFromGroup = (data) => {
      if (data.memberID !== userID) return; // Chỉ xử lý nếu chính người dùng bị kicks

      const fetchInfoGroup = async () => {
        const conversationID = data.conversationID;
        if (!conversationID) return;
        try {
          const groupInfo = await getGroupInfo(conversationID);
          console.log("groupInfo", groupInfo.data);
          toast.error(`Bạn đã bị mời khỏi nhóm: ${groupInfo.data.groupName}`);
        } catch (err) {
          console.error("Lỗi khi lấy thông tin nhóm:", err);
        }
      };
      fetchInfoGroup();

      const conversationID =
        typeContent.conversation?.conversation?.conversationID;
      if (conversationID === data.conversationID) {
        setTypeContent({
          contentName: null,
          conversation: null,
        });
      }
    };

    socket.on("kickedFromGroup", handleKickedFromGroup);
    socket.on("memberKicked", handleChangeMemberOfGroup);
    socket.on("newMember", handleChangeMemberOfGroup);
    socket.on("grantAdmin", handleChangeMemberOfGroup);
    socket.on("grantDeputy", handleChangeMemberOfGroup);
    socket.on("revokeDeputy", handleChangeMemberOfGroup);
    socket.on("leaveMember", handleChangeMemberOfGroup);

    return () => {
      socket.off("kickedFromGroup", handleKickedFromGroup);
      socket.off("memberKicked", handleChangeMemberOfGroup);
      socket.off("newMember", handleChangeMemberOfGroup);
      socket.off("grantAdmin", handleChangeMemberOfGroup);
      socket.off("grantDeputy", handleChangeMemberOfGroup);
      socket.off("revokeDeputy", handleChangeMemberOfGroup);
      socket.off("leaveMember", handleChangeMemberOfGroup);
    };
  }, [socket, userID, typeContent, setMembers, setTypeContent]);
};

export default useMemberOfGroupSocket;
