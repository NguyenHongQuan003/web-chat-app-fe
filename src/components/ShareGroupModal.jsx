// src/components/AddFriendModal.jsx
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import Input from "./Input";
import { FaPhone, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { searchUserByPhoneNumber } from "../services/userService";
import { useAuth } from "../utils/authUtils";
import { getFriendList } from "../services/friendService";
import { useRecoilValue } from "recoil";
import Loading from "./Loading";
import { selectedMessageState } from "../recoil/shareAtom";
import { shareMessage } from "../services/groupService";
import { getMyGroups } from "../services/groupService";

const ShareGroupModal = ({ isOpen, onClose }) => {
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const modalRef = useRef(null);
  const { user: userAuth } = useAuth();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [activeTab, setActiveTab] = useState("friends");
  const [friendList, setFriendList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const results = await getFriendList();
        setFriendList(results);
      } catch (error) {
        // console.log(error);
        if (error.response.data.statusCode === 404) {
          setFriendList([]);
        }
      }
    };

    const fetchMyGroupList = async () => {
      try {
        const res = await getMyGroups();
        setGroupList(res.data);
      } catch (error) {
        console.log("fetching Group list", error);
      }
    };

    fetchMyGroupList();
    fetchFriendList();
  }, [searchResults]);

  const selectedMessage = useRecoilValue(selectedMessageState);

  // useEffect(() => {
  //   console.log("selected message", selectedMessage);
  // }, [selectedMessage]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleSearch = async () => {
    setIsLoadingSearch(true);
    try {
      const res = await searchUserByPhoneNumber(phoneNumber);
      if (userAuth.userID !== res.userID) {
        setSearchResults([res]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setSearchResults([]);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const toggleSelectUser = (user) => {
    const exists = selectedUsers.find(
      (u) => u.userID === user.userID && u.type === "user"
    );
    if (exists) {
      setSelectedUsers(
        selectedUsers.filter(
          (u) => u.userID !== user.userID || u.type !== "user"
        )
      );
    } else {
      setSelectedUsers([...selectedUsers, { ...user, type: "user" }]);
    }
  };

  const toggleSelectGroup = (group) => {
    const exists = selectedUsers.find(
      (g) => g.groupID === group.groupID && g.type === "group"
    );
    if (exists) {
      setSelectedUsers(
        selectedUsers.filter(
          (g) => g.groupID !== group.groupID || g.type !== "group"
        )
      );
    } else {
      setSelectedUsers([...selectedUsers, { ...group, type: "group" }]);
    }
  };
  const handleShare = async () => {
    const receiverIds = selectedUsers
      .filter((u) => u.type === "user")
      .map((u) => u.userID);

    const groupIDs = selectedUsers
      .filter((g) => g.type === "group")
      .map((g) => g.groupID);

    try {
      await shareMessage(
        selectedMessage.message.messageID,
        groupIDs,
        receiverIds,
        selectedMessage.message.conversationID
      );
      toast.success("Chia sẻ tin nhắn thành công");
      onClose();
    } catch (error) {
      console.error("Error sharing message:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex bg-[#000000]/60  justify-center items-center z-50 opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-[650px] overflow-hidden shadow-xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center py-4 px-2 border-b border-gray-300">
          <h2 className="text-[16px] font-semibold">Chia sẻ</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Search input */}
        <div className="px-2 py-2">
          <div className="flex space-x-1">
            <Input
              type="tel"
              name="phoneNumber"
              className="flex-1 p-2 border-b border-gray-300 focus:border-[#005ae0] text-sm focus:outline-none"
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              icon={FaPhone}
            />
            <button
              onClick={handleSearch}
              className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isLoadingSearch ? (
                <div className="flex items-center justify-center">
                  <Loading size="sm" />
                  <span>...</span>
                </div>
              ) : (
                "Tìm"
              )}
            </button>
          </div>
        </div>

        {/* Search results */}
        <div className="flex ">
          <div className="min-w-1/2 border-r border-gray-300">
            <h3 className="text-xs px-4 text-gray-500 mb-2">
              Kết quả tìm kiếm
            </h3>

            {searchResults.length > 0 ? (
              <div className="h-20 max-h-20 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.userID}
                    className="px-4 flex justify-between items-center hover:bg-gray-200 cursor-pointer"
                    onClick={() => toggleSelectUser(user)}
                  >
                    <div className="flex items-center py-2">
                      <input
                        type="checkbox"
                        checked={
                          !!selectedUsers.find((u) => u.userID === user.userID)
                        }
                        readOnly
                        className="mr-2"
                      />
                      <img
                        src={user.avatar}
                        alt={user.avatar}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-[14px]">{user.fullName}</p>
                        <p className="text-xs text-gray-500">
                          {user.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="py-2 text-center"></div>
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500"></div>
            )}

            <button
              onClick={() => setActiveTab("friends")}
              className={`text-xs px-4 mb-2 pb-1 ${
                activeTab === "friends"
                  ? "text-[#0078E8] shadow-[inset_0_-2px_0_0_#0078E8]"
                  : "text-gray-500"
              }`}
            >
              Bạn bè
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`text-xs px-4 mb-2 pb-1 ${
                activeTab === "groups"
                  ? "text-[#0078E8] shadow-[inset_0_-2px_0_0_#0078E8]"
                  : "text-gray-500"
              }`}
            >
              Nhóm
            </button>

            {activeTab === "friends" && friendList.length > 0 && (
              <div className="h-60 max-h-60 overflow-y-auto">
                {friendList.map((user) => (
                  <div
                    key={user.userID}
                    className="px-4 flex justify-between items-center hover:bg-gray-200 cursor-pointer"
                    onClick={() => toggleSelectUser(user)}
                  >
                    <div className="flex items-center py-2">
                      <input
                        type="checkbox"
                        checked={
                          !!selectedUsers.find((u) => u.userID === user.userID)
                        }
                        readOnly
                        className="mr-2"
                      />
                      <img
                        src={user.avatar}
                        alt={user.avatar}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-[14px]">{user.fullName}</p>
                        <p className="text-xs text-gray-500">
                          {user.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "groups" && groupList.length > 0 && (
              <div className="h-60 max-h-60 overflow-y-auto">
                {groupList.map((group) => (
                  <div
                    key={group.groupID}
                    className="px-4 flex justify-between items-center hover:bg-gray-200 cursor-pointer"
                    onClick={() => toggleSelectGroup(group)}
                  >
                    <div className="flex items-center py-2">
                      <input
                        type="checkbox"
                        checked={
                          !!selectedUsers.find(
                            (u) => u.groupID === group.groupID
                          )
                        }
                        readOnly
                        className="mr-2"
                      />
                      <img
                        src={group.groupAvatar}
                        alt={group.groupName}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-[14px]">{group.groupName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="px-2">
            <h4 className="text-xs text-gray-500 mb-1">
              Đã chọn: {selectedUsers.length}/100
            </h4>
            {selectedUsers.length > 0 && (
              <div className="w-full h-90 max-h-90 overflow-y-auto">
                <div className="flex flex-wrap gap-2 px-2">
                  {selectedUsers.map((item) => (
                    <div
                      key={item.type === "user" ? item.userID : item.groupID}
                      className="flex items-center bg-gray-100 px-2 py-1 rounded-full"
                    >
                      <img
                        src={
                          item.type === "user" ? item.avatar : item.groupAvatar
                        }
                        alt={
                          item.type === "user" ? item.avatar : item.groupName
                        }
                        className="w-6 h-6 rounded-full mr-1"
                      />
                      <span className="text-sm">
                        {item.type === "user" ? item.fullName : item.groupName}
                      </span>
                      <FaTimes
                        className="ml-1 cursor-pointer text-gray-500"
                        onClick={() =>
                          item.type === "user"
                            ? toggleSelectUser(item)
                            : toggleSelectGroup(item)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="h-10 max-h-10 w-full bg-gray-200 flex items-center text-gray-500 text-[15px] p-1">
          <span className="truncate block w-full">
            Chia sẻ tin nhắn: {selectedMessage?.message?.messageContent}
          </span>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 font-[600] p-4 border-t mt-1 border-gray-300">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleShare}
            className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isLoadingSearch ? (
              <div className="flex items-center justify-center gap-2">
                <Loading size="sm" />
                <span>Sharing...</span>
              </div>
            ) : (
              "Chia sẻ"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

ShareGroupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ShareGroupModal;
