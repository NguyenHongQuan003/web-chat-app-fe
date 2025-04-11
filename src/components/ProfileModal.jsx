// src/components/AddFriendModal.jsx
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { FaTimes, FaCamera } from "react-icons/fa";
import { useAuth } from "../utils/authUtils";
import Button from "./Button";
import Loading from "../components/Loading";
import { updateAvatarUser } from "../services/userService";
import { toast } from "react-toastify";

const ProfileModal = ({ isOpen, onClose }) => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [editAvatar, setEditAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    avatar: user?.avatar || null,
    // fullName: user?.fullName || "",
    // phoneNumber: user?.phone || "",
    // gender: user?.gender.toString() || "",
    // dayOfBirth: user?.dayOfBirth || "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      avatar: user?.avatar || null,
      // fullName: user?.fullName || "",
      // phoneNumber: user?.phone || "",
      // gender: user?.gender.toString() || "",
      // dayOfBirth: user?.dayOfBirth || "",
    }));
    setAvatarPreview(user?.avatar);
  }, [user]);

  const initValue = () => {
    setAvatarPreview(user?.avatar);
    setEditAvatar(false);
    // setFormData((prev) => ({ ...prev, avatar: user?.avatar }));
  };

  const handleAvatarChange = (e) => {
    const selectedFile = e.target.files[0];
    setFormData((prev) => ({ ...prev, avatar: selectedFile }));
    setEditAvatar(true);
    setAvatarPreview(URL.createObjectURL(selectedFile));
  };

  const handleSaveAvatar = async () => {
    setIsLoading(true);
    try {
      const response = await updateAvatarUser(formData);
      console.log("location:", response.avatar);
      updateUser({ ...user, avatar: response.avatar });
      toast.success("Cập nhật ảnh đại diện thành công");
      setEditAvatar(false);
    } catch {
      toast.error("Cập nhật ảnh đại diện thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
      initValue();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex bg-[#000000]/60 justify-center items-center z-50 opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-[400px] overflow-hidden shadow-xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-300">
          <h2 className="font-medium">Thông tin tài khoản</h2>
          <button
            onClick={() => {
              onClose();
              initValue();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Cover Image */}
          <div className="relative h-40 -mx-6 -mt-6 mb-4">
            <img
              src="https://images.unsplash.com/photo-1707343843437-caacff5cfa74"
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Avatar */}
          <div className="relative -mt-10 mb-4 flex items-center">
            <div className="relative">
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-gray-100 p-2 rounded-full border border-gray-300 hover:bg-gray-200">
                <FaCamera className="w-4 h-4 text-gray-600" />
                <input
                  type="file"
                  name="avatar"
                  onChange={handleAvatarChange}
                  className="hidden w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </label>
            </div>

            <span className="ml-4 text-xl">{user?.fullName}</span>
          </div>
          <div className="-mx-6 border-2 border-gray-200"></div>
          {/* User Info */}
          <div className="space-y-4">
            <div>
              <h3 className="mt-4">Thông tin cá nhân</h3>
            </div>

            <table className="w-full text-sm text-left text-gray-500">
              <tbody>
                <tr>
                  <td>Giới tính</td>
                  <td className="py-2 pl-10">{user?.gender ? "Nam" : "Nữ"}</td>
                </tr>
                <tr>
                  <td>Ngày sinh</td>
                  <td className="py-2 pl-10">{user?.dayOfBirth}</td>
                </tr>
                <tr>
                  <td>Điện thoại</td>
                  <td className="py-2 pl-10">{user?.phoneNumber}</td>
                </tr>
              </tbody>
            </table>

            <div className="text-xs text-gray-500">
              Chỉ bạn bè có số của bạn trong danh bạ máy mới xem được số này
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between p-4 border-t border-gray-300">
          {editAvatar && (
            <div className="flex justify-end">
              <Button
                disabled={isLoading}
                className="text-sm"
                onClick={handleSaveAvatar}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loading size="sm" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          )}
          <div className="space-x-2 ml-auto">
            <Button
              onClick={() => {
                onClose();
                initValue();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-500 rounded-md hover:bg-gray-200"
            >
              Đóng
            </Button>
            <Button className="px-4 py-2 text-sm font-medium text-white bg-[#0078E8] rounded-md hover:bg-[#0066CC]">
              Cập nhật
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProfileModal;
