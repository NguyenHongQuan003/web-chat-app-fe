import { useRecoilValue, useSetRecoilState } from "recoil";
import { isManagerGroupState } from "../recoil/managerGroupAtom";
import PropTypes from "prop-types";
import { FaEllipsisV, FaKey, FaUserPlus } from "react-icons/fa";
import { useAuth } from "../utils/authUtils";
import { useEffect, useRef, useState } from "react";
import { deleteGroup, kickMember, leaveGroup } from "../services/groupService";
import { typeContentState } from "../recoil/leftPanelAtom";
import { isInviteIntoGroupModalOpenState } from "../recoil/inviteIntoGroupAtom";

const ManagerGroup = ({ members }) => {
  const isManagerGroup = useRecoilValue(isManagerGroupState);
  const { user: userAuth } = useAuth();
  const [selectedMember, setSelectedMember] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const dropdownRef = useRef(null);
  const setIsInviteIntoGroupModalOpen = useSetRecoilState(
    isInviteIntoGroupModalOpenState
  );

  const isUserAuth = (userID) => userAuth?.userID === userID;
  const roleAdmin = (role) => role === "admin";
  const setTypeContent = useSetRecoilState(typeContentState);
  const roleOfUserAuth = members.find(
    (member) => member?.userInfo?.userID === userAuth?.userID
  )?.role;

  // Click ngoài vùng dropdown sẽ đóng menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSelectedMember(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKickMember = async (member) => {
    try {
      await kickMember(member?.groupID, member?.userInfo?.userID);
    } catch (error) {
      console.log(error);
    }
    setSelectedMember(null);
  };
  const handleDeleteGroup = async () => {
    try {
      const groupID = members[0]?.groupID;
      await deleteGroup(groupID);

      // Reset lại state sau khi giải tán nhóm
      setTypeContent({
        contentName: null,
        conversation: null,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const groupID = members[0]?.groupID;
      await leaveGroup(groupID);

      // set type content về null
      setTypeContent({
        contentName: null,
        conversation: null,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenInviteIntoGroupModal = () => {
    setIsInviteIntoGroupModalOpen(true);
  };

  return (
    <div
      className={`bg-white border-l border-gray-300 min-w-[350px] max-w-[350px] ${
        isManagerGroup ? "block" : "hidden"
      }`}
    >
      {/* Header */}
      <div className="flex justify-center items-center border-b border-gray-300">
        <h2 className="text-lg py-[22px] font-[550]">Thành viên</h2>
      </div>

      <div className="flex justify-center items-center px-2">
        <button
          hidden={!roleAdmin(roleOfUserAuth)}
          onClick={handleOpenInviteIntoGroupModal}
          className="flex items-center bg-gray-200 w-full py-1 rounded-xs mt-4 cursor-pointer hover:bg-gray-300 justify-center gap-1.5"
        >
          <FaUserPlus color="#5c6b82" />
          <span>Thêm thành viên</span>
        </button>
      </div>

      <div className="flex justify-center items-center px-2">
        <button
          hidden={!roleAdmin(roleOfUserAuth)}
          onClick={handleDeleteGroup}
          className="flex items-center bg-red-200 w-full py-1 rounded-xs mt-4 cursor-pointer hover:bg-red-300 justify-center gap-1.5"
        >
          <span className="text-[#c31919]">Giải tán nhóm</span>
        </button>
      </div>
      <div className="flex justify-center items-center px-2">
        <button
          onClick={handleLeaveGroup}
          hidden={roleAdmin(roleOfUserAuth)}
          className="flex items-center bg-red-200 w-full py-1 rounded-xs mt-4 cursor-pointer hover:bg-red-300 justify-center gap-1.5"
        >
          <span className="text-[#c31919]">Rời nhóm</span>
        </button>
      </div>

      <div className="ml-2 my-4 text-sm font-[600]">
        Danh sách thành viên ({members.length})
      </div>

      <ul>
        {members.map((member, index) => (
          <div
            key={index}
            className="relative pl-2 flex items-center py-3 cursor-pointer hover:bg-gray-200"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={member?.userInfo?.avatar}
              className="w-11 h-11 rounded-full object-cover border border-gray-600"
              alt={member?.userInfo?.fullName}
            />
            {roleAdmin(member?.role) && (
              <div className="absolute bg-[#000000]/50 rounded-full left-9 flex justify-center items-center bottom-2 p-1">
                <FaKey color="yellow" className="h-3 w-3" />
              </div>
            )}
            <div className="pl-2">
              <div className="text-sm font-[600]">
                {isUserAuth(member?.userInfo?.userID)
                  ? "Bạn"
                  : member?.userInfo?.fullName}
              </div>
              <div className="text-xs">
                {roleAdmin(member?.role) ? "Trưởng nhóm" : ""}
              </div>
            </div>

            {/* Icon 3 chấm chỉ hiện khi hover */}
            {hoveredIndex === index && (
              <button
                onClick={() =>
                  selectedMember?.userInfo?.userID === member?.userInfo?.userID
                    ? setSelectedMember(null)
                    : setSelectedMember(member)
                }
                className="ml-auto z-10 hover:bg-white rounded-full p-1 cursor-pointer"
              >
                <FaEllipsisV color="#5c6b82" />
              </button>
            )}

            {/* Dropdown tùy chọn thành viên */}
            {selectedMember?.userInfo?.userID === member?.userInfo?.userID &&
              roleAdmin(roleOfUserAuth) &&
              !isUserAuth(member?.userInfo?.userID) && (
                <div
                  ref={dropdownRef}
                  className="absolute text-sm top-12 right-0 bg-white border border-gray-300 rounded-md shadow-lg w-40 z-20"
                >
                  <div
                    onClick={() => alert("Đặt trưởng nhóm")}
                    className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <span>Đặt trưởng nhóm</span>
                  </div>
                  <div
                    onClick={() => handleKickMember(member)}
                    className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <span>Kích thành viên</span>
                  </div>
                </div>
              )}
          </div>
        ))}
      </ul>
    </div>
  );
};

ManagerGroup.propTypes = {
  members: PropTypes.array.isRequired,
};

export default ManagerGroup;
