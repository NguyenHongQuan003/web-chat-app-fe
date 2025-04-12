// src/components/AddFriendModal.jsx
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { FaTimes, FaCamera, FaArrowLeft, FaUser } from "react-icons/fa";
import { useAuth } from "../utils/authUtils";
import Button from "./Button";
import Loading from "../components/Loading";
import { updateAvatarUser, updateProfileUser } from "../services/userService";
import { toast } from "react-toastify";
import Input from "./Input";
import { validateDayOfBirth, validateFullName } from "../utils/validate";

const ProfileModal = ({ isOpen, onClose }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [editAvatar, setEditAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    avatar: user?.avatar || null,
    fullName: user?.fullName || "",
    gender: user?.gender.toString() || "",
    dayOfBirth: user?.dayOfBirth || "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      avatar: user?.avatar || null,
      fullName: user?.fullName || "",
      gender: user?.gender.toString() || "",
      dayOfBirth: user?.dayOfBirth || "",
    }));
    setAvatarPreview(user?.avatar);
  }, [user]);

  const initValue = () => {
    setAvatarPreview(user?.avatar);
    setEditAvatar(false);
    setFormData({
      ...user,
      gender: user?.gender.toString() || "",
    });
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

  // useEffect(() => {
  //   console.log("Form data:", formData);
  // }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "fullName":
        setErrors((prev) => ({
          ...prev,
          fullName: validateFullName(value),
        }));
        break;
      case "dayOfBirth":
        setErrors((prev) => ({
          ...prev,
          dayOfBirth: validateDayOfBirth(value),
        }));
        break;
      default:
        break;
    }
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
      initValue();
    }
  };

  if (!isOpen) return null;

  const renderProfile = () => {
    return (
      <>
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
                  <td className="py-2 pl-10">
                    {user?.gender.toString() === "true" ? "Nam" : "Nữ"}
                  </td>
                </tr>
                <tr>
                  <td>Ngày sinh</td>
                  <td className="py-2 pl-10">
                    {/* {formatDateToVietnamese(user?.dayOfBirth)} */}
                    {user?.dayOfBirth}
                  </td>
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
            <div className="space-x-2">
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
                  "Lưu"
                )}
              </Button>
              <button
                onClick={() => {
                  initValue();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-100 bg-gray-400 rounded-md hover:bg-gray-500"
              >
                Hủy
              </button>
            </div>
          )}
          <div className="space-x-2 ml-auto">
            <button
              onClick={() => setIsEdit(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0078E8] rounded-md hover:bg-[#0066CC]"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </>
    );
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await updateProfileUser(formData);
      if (response) {
        updateUser({
          ...user,
          fullName: response.fullName,
          gender: response.gender,
          dayOfBirth: response.dayOfBirth,
        });
        toast.success("Cập nhật thông tin cá nhân thành công");
        setIsEdit(false);
        initValue();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Cập nhật thông tin cá nhân thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const renderEditProfile = () => {
    return (
      <>
        {/* Header */}
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-300">
          <div className="flex items-center -ml-4">
            <button
              className="mr-1 cursor-pointer bg-gray-100 p-3 rounded-full hover:bg-gray-200"
              onClick={() => {
                setIsEdit(false);
                initValue();
              }}
            >
              <FaArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="font-medium">Cập nhật thông tin cá nhân</h2>
          </div>
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
          <label>Tên hiển thị</label>
          <Input
            type="text"
            name="fullName"
            placeholder="Tên người dùng"
            icon={FaUser}
            required
            onChange={handleChange}
            value={formData.fullName}
            error={errors.fullName}
          />
          <div className="mb-4">
            <h3 className="mt-4">Thông tin cá nhân</h3>
          </div>
          <div className="flex flex-row gap-x-3 mb-4">
            <div className="flex items-center gap-x-3">
              <input
                id="gender-male"
                name="gender"
                type="radio"
                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                onChange={handleChange}
                checked={formData.gender === "true"}
                value="true"
              />
              <label
                htmlFor="gender-male"
                className="block font-medium text-gray-600"
              >
                Nam
              </label>
            </div>
            <div className="flex items-center gap-x-3">
              <input
                id="gender-female"
                name="gender"
                type="radio"
                checked={formData.gender === "false"}
                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                onChange={handleChange}
                value="false"
              />
              <label
                htmlFor="gender-female"
                className="block font-medium text-gray-600"
              >
                Nữ
              </label>
            </div>
          </div>

          <label>Ngày sinh</label>
          <Input
            type="date"
            name="dayOfBirth"
            placeholder="Ngày sinh"
            onChange={handleChange}
            value={formData.dayOfBirth}
            error={errors.dayOfBirth}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between p-4 border-t border-gray-300">
          <div className="space-x-2 ml-auto">
            <button
              onClick={() => {
                setIsEdit(false);
                initValue();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-100 bg-gray-400 rounded-md hover:bg-gray-500"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0078E8] rounded-md hover:bg-[#0066CC]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loading size="sm" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Lưu"
              )}
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      className="fixed inset-0 flex bg-[#000000]/60 justify-center items-center z-50 opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-[400px] overflow-hidden shadow-xl"
      >
        {isEdit ? renderEditProfile() : renderProfile()}
      </div>
    </div>
  );
};

ProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProfileModal;
