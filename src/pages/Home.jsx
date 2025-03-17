import { APP_INFO } from "../constants/common.constants";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

const Home = () => {
  return (
    <>
      <div className="bg-blue-600 text-white p-4 flex justify-between fixed top-0 left-0 right-0 z-50">
        <div>
          <span className="font-bold mr-4">{APP_INFO.NAME}</span>
          <button className="mr-4">Tin nhắn</button>
          <button className="mr-4">Danh bạ</button>
        </div>
        <div>
          <button className="mr-4">Cá nhân</button>
        </div>
      </div>
      <div className="min-h-screen flex flex-col pt-16">
        <div className="flex flex-1">
          <ChatList />
          <ChatWindow />
        </div>
      </div>
    </>
  );
};

export default Home;
