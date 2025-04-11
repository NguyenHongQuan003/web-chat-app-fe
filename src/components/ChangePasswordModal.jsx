// src/components/AddFriendModal.jsx
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { FaTimes, FaLock } from "react-icons/fa";
import Loading from "./Loading";
import { updateNewPassword } from "../services/userService";
import { toast } from "react-toastify";
import Input from "./Input";
import { validateConfirmPassword, validatePassword } from "../utils/validate";
import Button from "./Button";
import { isChangePasswordModalOpenState } from "../recoil/leftPanelAtom";
import { useSetRecoilState } from "recoil";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const setIsChangePasswordModalOpen = useSetRecoilState(
    isChangePasswordModalOpenState
  );
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    currentPassWord: "",
    newPassWord: "",
    confirm_password: "",
  });

  const initValue = () => {
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "currentPassWord":
        setErrors((prev) => ({
          ...prev,
          currentPassWord: validatePassword(value),
        }));
        break;
      case "newPassWord":
        setErrors((prev) => ({
          ...prev,
          newPassWord: validatePassword(value),
        }));
        setErrors((prev) => ({
          ...prev,
          confirm_password: validateConfirmPassword(
            formData.confirm_password,
            value
          ),
        }));
        break;
      case "confirm_password":
        setErrors((prev) => ({
          ...prev,
          confirm_password: validateConfirmPassword(
            value,
            formData.newPassWord
          ),
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

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateNewPassword(formData);
      toast.success("Cập nhật mật khẩu thành công");
      setIsChangePasswordModalOpen(false);
      initValue();
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = () => {
    return (
      <>
        {/* Header */}
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-300">
          <div className="flex items-center ">
            <h2 className="font-medium">Cập nhật mật khẩu</h2>
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
        <div className="p-6 space-y-6">
          <label>Mật khẩu hiện tại</label>
          <Input
            type="password"
            name="currentPassWord"
            placeholder="Mật khẩu hiện tại"
            icon={FaLock}
            required
            onChange={handleChange}
            value={formData.currentPassWord}
            error={errors.currentPassWord}
          />
          <label>Mật khẩu mới</label>
          <Input
            type="password"
            name="newPassWord"
            placeholder="Mật khẩu mới"
            icon={FaLock}
            required
            onChange={handleChange}
            value={formData.newPassWord}
            error={errors.newPassWord}
          />

          <label>Xác nhận mật khẩu</label>
          <Input
            type="password"
            name="confirm_password"
            placeholder="Xác nhận mật khẩu"
            icon={FaLock}
            required
            onChange={handleChange}
            value={formData.confirm_password}
            error={errors.confirm_password}
          />
          <Button
            type="submit"
            fullWidth
            onClick={handleSaveProfile}
            disabled={
              !!errors.passWord || !!errors.confirm_password || isLoading
            }
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loading size="sm" />
                <span>Đang xử lý...</span>
              </div>
            ) : (
              "Xác nhận"
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="flex justify-between p-4 border-t border-gray-300">
          <div className="space-x-2 ml-auto">
            <button
              onClick={() => {
                initValue();
                setIsChangePasswordModalOpen(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-100 bg-gray-400 rounded-md hover:bg-gray-500"
            >
              Hủy
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
        {changePassword()}
      </div>
    </div>
  );
};

ForgotPasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ForgotPasswordModal;
