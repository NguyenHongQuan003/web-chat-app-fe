import { useEffect, useRef, useState } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../utils/authUtils";
import { FaAddressBook, FaCommentDots, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup sự kiện khi component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <div className=" flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="min-w-16 bg-[#005ae0] flex flex-col items-center py-4">
        <div className="text-white mb-6">
          {user ? (
            <div className="flex" ref={userDropdownRef}>
              <button
                className="flex items-center p-2 hover:cursor-pointer rounded-full "
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="h-12 w-12 rounded-full border-1 border-white"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute border border-gray-300 left-16 min-w-74 p-2 bg-white text-black rounded-md shadow-lg z-10">
                  <div className="px-4 font-bold cursor-default mb-2">
                    {user.fullName}
                  </div>
                  <Link
                    to="/profile"
                    className="border-t border-gray-300 block px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    Hồ sơ của bạn
                  </Link>
                  <Link
                    to="/setting"
                    className="border-b border-gray-300 block px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    Cài đặt
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className=" block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center">
              <div className="p-2 hover:cursor-pointer rounded-full bg-white">
                <FaUser className="text-[#0078E8] h-5 w-5" />
              </div>
            </Link>
          )}
        </div>
        <div className="space-y-2 text-white">
          <div className="rounded-md p-3 hover:bg-[#0043a8]">
            <FaCommentDots className="w-6 h-6 cursor-pointer" />
          </div>
          <div className="rounded-md p-3 hover:bg-[#0043a8]">
            <FaAddressBook className="w-6 h-6 cursor-pointer" />
          </div>
        </div>
        <div className="mt-auto space-y-2 text-white">
          <div className="rounded-md p-3 hover:bg-[#0043a8]">
            <FaGear className="w-6 h-6 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Chat List */}
      <ChatList />
      <ChatWindow />
    </div>
  );
};

export default Home;
