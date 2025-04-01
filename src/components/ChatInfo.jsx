import { useRecoilValue } from "recoil";
import { selectedConversationState } from "../recoil/leftPanelAtom";

const ChatInfo = () => {
  const selectedConversation = useRecoilValue(selectedConversationState);
  const chatDetails = {
    name: "Bạn A",
    status: "Đang hoạt động",
    // Thêm các thông tin khác nếu cần
  };

  return (
    <div className="bg-white border-l border-gray-300 w-[350px] p-4">
      <h2 className="text-xl font-bold">{selectedConversation?.name}</h2>
      <p className="text-sm text-gray-600">{chatDetails.status}</p>
      {selectedConversation?.id}
      {/* Thêm các thông tin khác */}
    </div>
  );
};

export default ChatInfo;
