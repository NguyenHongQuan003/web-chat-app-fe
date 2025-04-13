// src/components/AddFriendModal.jsx
import PropTypes from "prop-types";
import { useState, useRef } from "react";
import Input from "./Input";
import { FaPhone, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { searchUserByPhoneNumber } from "../services/userService";
import { useAuth } from "../utils/authUtils";
import {
  cancelFriendRequest,
  sendFriendRequest,
} from "../services/friendService";
import { useRecoilValue } from "recoil";
import { sentRequestListState } from "../recoil/sentRequestList";
import Loading from "./Loading";

const AddFriendModal = ({ isOpen, onClose }) => {
  const sentRequestList = useRecoilValue(sentRequestListState);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const modalRef = useRef(null);
  const { user: userAuth } = useAuth();

  const checkIfUserIsSentRequest = (userID) => {
    return sentRequestList.some((request) => request.userID === userID);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleSearch = async () => {
    setIsLoadingSearch(true);
    try {
      const res = await searchUserByPhoneNumber(phoneNumber);
      setSearchResults([res]);
    } catch (error) {
      toast.error("Lỗi khi tìm kiếm người dùng", error);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // Hàm kết bạn
  const handleAddFriend = async (receiverID) => {
    setIsLoading(true);
    try {
      console.log("receiverID", receiverID);
      await sendFriendRequest(receiverID);
      toast.success("Đã gửi lời mời kết bạn!");
    } catch (error) {
      toast.error("Lỗi khi gửi lời mời kết bạn", error);
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAddFriend = async (userID) => {
    setIsLoading(true);
    try {
      const res = await cancelFriendRequest(userID);
      console.log("handleCancel", res);
      toast.success("Đã hủy yêu cầu");
    } catch (error) {
      console.log("handleCancel", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenWindowChat = (userID) => {
    console.log("open chat window", userID);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex bg-[#000000]/60  justify-center items-center z-50 opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-[400px] overflow-hidden shadow-xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center py-4 px-2 border-b border-gray-300">
          <h2 className="text-[16px] font-semibold">Thêm bạn</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4">
          <div className="flex">
            <Input
              type="tel"
              className="flex-1 p-2 border-b border-gray-300 focus:border-[#005ae0] text-sm focus:outline-none"
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              icon={FaPhone}
            />
          </div>
        </div>

        {/* Search results */}
        <div>
          <h3 className="text-xs px-4 text-gray-500 mb-2">Kết quả tìm kiếm</h3>

          {searchResults.length > 0 ? (
            <div className="h-90 max-h-90 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user.userID}
                  className="px-4 flex justify-between items-center hover:bg-gray-200 cursor-pointer"
                >
                  <div className="flex items-center py-2">
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
                  {userAuth.userID !== user.userID &&
                    (checkIfUserIsSentRequest(user.userID) ? (
                      <div>
                        <button
                          onClick={() => handleOpenWindowChat(user.userID)}
                          className="min-w-[84px] text-[12px] px-4 py-1 rounded text-red-600 font-[700] hover:bg-red-100"
                        >
                          Nhắn tin
                        </button>
                        <button
                          onClick={() => handleCancelAddFriend(user.userID)}
                          className="min-w-[84px] text-[12px] px-4 py-1 rounded text-red-600 font-[700] hover:bg-red-100"
                          disabled={isLoading}
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
                    ) : (
                      <div>
                        <button
                          onClick={() => handleOpenWindowChat(user.userID)}
                          className="min-w-[84px] text-[12px] px-4 py-1 rounded text-red-600 font-[700] hover:bg-red-100"
                        >
                          Nhắn tin
                        </button>
                        <button
                          onClick={() => handleAddFriend(user.userID)}
                          className="min-w-[84px] text-[12px] px-4 py-1 rounded text-blue-700 font-[700] hover:bg-blue-100"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loading size="sm" />
                              <span>Đang xử lý...</span>
                            </div>
                          ) : (
                            "Kết bạn"
                          )}
                        </button>
                      </div>
                    ))}
                </div>
              ))}

              <div className="py-2 text-center">
                {/* <button className="cursor-pointer text-blue-500 hover:underline text-sm">
                  Xem thêm
                </button> */}
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">
              Nhập số điện thoại để tìm kiếm bạn bè
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 font-[600] p-4 border-t mt-4 border-gray-300">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSearch}
            className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isLoadingSearch ? (
              <div className="flex items-center justify-center gap-2">
                <Loading size="sm" />
                <span>Đang tìm...</span>
              </div>
            ) : (
              "Tìm kiếm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

AddFriendModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddFriendModal;
