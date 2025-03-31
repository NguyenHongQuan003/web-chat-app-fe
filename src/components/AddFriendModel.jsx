// src/components/AddFriendModal.jsx
import PropTypes from "prop-types";
import { useState, useRef } from "react";
import Input from "../components/common/Input";
import { FaPhone, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const AddFriendModal = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const modalRef = useRef(null);

  // Hàm xử lý khi click bên ngoài modal
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Hàm tìm kiếm người dùng
  const handleSearch = () => {
    // Giả lập kết quả tìm kiếm, sau này sẽ gọi API thực tế
    const mockResults = [
      {
        id: 1,
        name: "Đèn Trang Trí Hùng Thắng aaaaaa",
        phone: "0376 589 545",
        avatar: "https://picsum.photos/id/1/50/50",
        isFriend: false,
      },
      {
        id: 2,
        name: "Lê Minh Quang",
        phone: "0987 654 321",
        avatar: "https://picsum.photos/id/2/50/50",
        isFriend: false,
      },
      {
        id: 3,
        name: "Nguyễn Tấn Vinh",
        phone: "0912 345 678",
        avatar: "https://picsum.photos/id/3/50/50",
        isFriend: false,
      },
      {
        id: 4,
        name: "Phan Hoàng Tấn",
        phone: "0923 456 789",
        avatar: "https://picsum.photos/id/4/50/50",
        isFriend: false,
      },
      {
        id: 4,
        name: "Phan Hoàng Tấn",
        phone: "0923 456 789",
        avatar: "https://picsum.photos/id/4/50/50",
        isFriend: false,
      },
      {
        id: 4,
        name: "Phan Hoàng Tấn",
        phone: "0923 456 789",
        avatar: "https://picsum.photos/id/4/50/50",
        isFriend: false,
      },
      {
        id: 4,
        name: "Phan Hoàng Tấn",
        phone: "0923 456 789",
        avatar: "https://picsum.photos/id/4/50/50",
        isFriend: false,
      },
      {
        id: 4,
        name: "Phan Hoàng Tấn",
        phone: "0923 456 789",
        avatar: "https://picsum.photos/id/4/50/50",
        isFriend: false,
      },
    ];

    setSearchResults(mockResults);
    toast.info("Đã tìm thấy một số người dùng");
  };

  // Hàm kết bạn
  const handleAddFriend = (userId) => {
    // Gọi API kết bạn thực tế ở đây
    toast.success("Đã gửi lời mời kết bạn!");

    // Cập nhật UI
    setSearchResults((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isFriend: true } : user
      )
    );
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
          <h3 className="text-xs px-4 text-gray-500 mb-2">Kết quả gần nhất</h3>

          {searchResults.length > 0 ? (
            <div className="h-90 max-h-90 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="px-4 flex justify-between items-center hover:bg-gray-200 cursor-pointer"
                >
                  <div className="flex items-center py-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-[14px]">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFriend(user.id)}
                    className="min-w-[84px] text-[12px] px-4 py-1 rounded outline-1 text-blue-700 font-[700] hover:bg-blue-100 outline-[#0078E8]"
                    disabled={user.isFriend}
                  >
                    {user.isFriend ? "Đã gửi" : "Kết bạn"}
                  </button>
                </div>
              ))}

              <div className="py-2 text-center">
                <button className="cursor-pointer text-blue-500 hover:underline text-sm">
                  Xem thêm
                </button>
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
            Tìm kiếm
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
