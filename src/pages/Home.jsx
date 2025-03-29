import { useState } from "react";
import { APP_INFO } from "../constants/common.constants";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../utils/authUtils";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <>
      <div className="bg-blue-600 text-white p-4 flex justify-between fixed top-0 left-0 right-0 z-50">
        <div>
          <span className="font-bold mr-4">{APP_INFO.NAME}</span>
          <button className="mr-4">Tin nhắn</button>
          <button className="mr-4">Danh bạ</button>
        </div>
        <div>
          {/* Login/Register */}
          {user ? (
            <div className="relative">
              <button
                className="flex items-center p-2 hover:cursor-pointer rounded-full bg-white"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="h-6 w-6 rounded-full"
                />
                <span className="hidden md:block text-[#0078E8] ml-1 text-xs truncate max-w-50">
                  {`Xin chào, `}
                  <strong>{user.fullName}</strong>
                </span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    Hồ sơ
                  </Link>
                  <button
                    onClick={signOut}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
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
              <span className="hidden md:block text-white ml-1">Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
      <div className="min-h-screen flex flex-col pt-16">
        <div className="flex flex-1">
          <ChatList />
          <ChatWindow />
          {/* Content sẽ được thêm sau */}
          Trang chủ
          <div>
            {user ? (
              <>
                <h2>Xin chào, {user.fullName}</h2>
                <button onClick={signOut}>Đăng xuất</button>
              </>
            ) : (
              <p>Vui lòng đăng nhập</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
