import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import Input from "./Input";
import { FaCamera, FaPhone, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { searchUserByPhoneNumber } from "../services/userService";
import { useAuth } from "../utils/authUtils";
import { getFriendList } from "../services/friendService";
import Loading from "./Loading";
import { createGroup } from "../services/groupService";
import { validateGroupName } from "../utils/validate";
import { typeContentState } from "../recoil/leftPanelAtom";
import { useSetRecoilState } from "recoil";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const modalRef = useRef(null);
  const { user: userAuth } = useAuth();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [errors, setErrors] = useState({});
  const setTypeContent = useSetRecoilState(typeContentState);

  // Thêm state mới
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(null);

  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const results = await getFriendList();
        setFriendList(results);
      } catch (error) {
        if (error.response?.data?.statusCode === 404) {
          setFriendList([]);
        }
      }
    };

    fetchFriendList();
  }, [searchResults]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleCancel = () => {
    setPhoneNumber("");
    setSearchResults([]);
    setSelectedUsers([]);
    setGroupName("");
    setGroupImage(null);
    onClose();
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
      toast.error(error.response?.data?.message || "Lỗi tìm kiếm.");
      setSearchResults([]);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const toggleSelectUser = (user) => {
    const exists = selectedUsers.find((u) => u.userID === user.userID);
    if (exists) {
      setSelectedUsers(selectedUsers.filter((u) => u.userID !== user.userID));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Vui lòng nhập tên nhóm!");
      return;
    }

    if (selectedUsers.length < 2) {
      toast.error("Nhóm phải có ít nhất 2 thành viên!");
      return;
    }

    if (groupImage === null) {
      toast.error("Vui lòng chọn ảnh nhóm!");
      return;
    }

    const members = selectedUsers.map((user) => user.userID);

    try {
      const response = await createGroup(groupName, members, groupImage);
      // console.log("Group created successfully:", response);
      toast.success("Tạo nhóm thành công!");
      handleCancel();
      setTypeContent({
        contentName: "conversation",
        conversation: {
          conversation: response.data,
        },
      });
    } catch (error) {
      toast.error("Tạo nhóm thất bại!");
      console.error("Create group error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setGroupName(value);

    switch (name) {
      case "groupName":
        setErrors((prev) => ({
          ...prev,
          groupName: validateGroupName(value),
        }));
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex bg-[#000000]/60 justify-center items-center z-50"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-[400px] overflow-hidden shadow-xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center py-4 px-2 border-b border-gray-300">
          <h2 className="text-[16px] font-semibold">Tạo nhóm</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Nhập tên và chọn ảnh nhóm */}
        <div className="px-4 py-2">
          <div className="flex items-center space-x-3">
            <label htmlFor="groupImage" className="cursor-pointer">
              {groupImage ? (
                <img
                  src={URL.createObjectURL(groupImage)}
                  alt="Group Avatar"
                  className="w-14 h-14 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                  <FaCamera />
                </div>
              )}
              <input
                type="file"
                id="groupImage"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setGroupImage(e.target.files[0]);
                  }
                }}
              />
            </label>
            <div className="flex-1 flex flex-col space-y-1">
              <label className="text-xs">Tên nhóm</label>
              <Input
                type="text"
                name="groupName"
                placeholder="Nhập tên nhóm..."
                value={groupName}
                onChange={handleChange}
                className="flex-1 p-2 border-b border-gray-300 focus:border-[#005ae0] text-sm focus:outline-none"
                error={errors.groupName}
              />
            </div>
          </div>
        </div>

        {/* Tìm số điện thoại */}
        <div className="px-2 py-4">
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

        {/* Kết quả tìm kiếm */}
        {searchResults.length > 0 && (
          <>
            <h3 className="text-xs px-4 text-gray-500 mb-2">
              Kết quả tìm kiếm
            </h3>
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
            </div>
          </>
        )}

        {/* Danh sách bạn bè */}
        <h3 className="text-xs px-4 text-gray-500 mb-2">Danh sách bạn bè</h3>
        <div className="h-40 max-h-40 overflow-y-auto">
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
                  <p className="text-xs text-gray-500">{user.phoneNumber}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Danh sách đã chọn */}
        <h4 className="text-xs text-gray-500 mb-1 px-4">
          Đã chọn: {selectedUsers.length}/100
        </h4>
        {selectedUsers.length > 0 && (
          <div className="w-full h-30 max-h-30 overflow-y-auto px-2 pb-2">
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.userID}
                  className="flex items-center bg-gray-100 px-2 py-1 rounded-full"
                >
                  <img
                    src={user.avatar}
                    alt={user.avatar}
                    className="w-6 h-6 rounded-full mr-1"
                  />
                  <span className="text-sm">{user.fullName}</span>
                  <FaTimes
                    className="ml-1 cursor-pointer text-gray-500"
                    onClick={() => toggleSelectUser(user)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end space-x-2 font-[600] p-4 border-t mt-1 border-gray-300">
          <button
            onClick={handleCancel}
            className="cursor-pointer px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleCreateGroup}
            className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isLoadingSearch ? (
              <div className="flex items-center justify-center gap-2">
                <Loading size="sm" />
                <span>Đang tạo...</span>
              </div>
            ) : (
              "Tạo nhóm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

CreateGroupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateGroupModal;
