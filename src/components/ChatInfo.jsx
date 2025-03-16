// src/components/ChatInfo.jsx
import React from "react";

const ChatInfo = () => {
  const chatDetails = {
    name: "Bạn A",
    status: "Đang hoạt động",
    // Thêm các thông tin khác nếu cần
  };

  return (
    <div className="bg-white p-4 shadow-lg mb-4 w-1/3">
      <h2 className="text-xl font-bold">{chatDetails.name}</h2>
      <p className="text-sm text-gray-600">{chatDetails.status}</p>
      {/* Thêm các thông tin khác */}
    </div>
  );
};

export default ChatInfo;
