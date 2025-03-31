import { useEffect, useRef, useState } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../utils/authUtils";
import { FaAddressBook, FaCommentDots, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import UserDropDown from "../components/common/UserDropDown";

const Home = () => {
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
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                  className="h-12 w-12 rounded-full border-1 border-white object-cover"
                />
              </button>
              {isDropdownOpen && <UserDropDown user={user} signOut={signOut} />}
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
