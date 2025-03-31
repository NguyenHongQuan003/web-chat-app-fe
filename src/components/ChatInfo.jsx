const ChatInfo = () => {
  const chatDetails = {
    name: "Bạn A",
    status: "Đang hoạt động",
    // Thêm các thông tin khác nếu cần
  };

  return (
    <div className="bg-white border-l border-gray-300 p-4 w-1/3">
      <h2 className="text-xl font-bold">{chatDetails.name}</h2>
      <p className="text-sm text-gray-600">{chatDetails.status}</p>
      {/* Thêm các thông tin khác */}
    </div>
  );
};

export default ChatInfo;
