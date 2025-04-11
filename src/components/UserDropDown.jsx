import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isProfileModalOpenState } from "../recoil/leftPanelAtom";
import { useSetRecoilState } from "recoil";

const UserDropDown = ({ user, signOut }) => {
  const setIsProfileModalOpen = useSetRecoilState(isProfileModalOpenState);
  const navigate = useNavigate();
  const handleSignOut = () => {
    try {
      signOut();
      toast.success("Đăng xuất thành công!");
      navigate("/login");
    } catch (error) {
      toast.error("Đăng xuất thất bại!", error.message);
    }
  };

  return (
    <div className="absolute border border-gray-300 left-16 min-w-74 p-2 bg-white text-black rounded-md shadow-lg z-10">
      <div className="px-4 font-bold cursor-default mb-2">{user.fullName}</div>
      <div
        to="/profile"
        className="border-t border-gray-300 block px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
        onClick={() => setIsProfileModalOpen(true)}
      >
        Hồ sơ của bạn
      </div>
      <Link to="/setting" className="block px-4 py-2 text-sm hover:bg-gray-200">
        Đổi mật khẩu mới
      </Link>
      <Link
        to="/setting"
        className="border-b border-gray-300 block px-4 py-2 text-sm hover:bg-gray-200"
      >
        Cài đặt
      </Link>
      <button
        onClick={handleSignOut}
        className="cursor-pointer block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
      >
        Đăng xuất
      </button>
    </div>
  );
};

UserDropDown.propTypes = {
  user: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
};

export default UserDropDown;
