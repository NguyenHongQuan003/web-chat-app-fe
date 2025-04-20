// import React from "react";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { getFriendList } from "../services/friendService";

// Danh sách bạn bè lấy trạng thái accept

const GroupList = () => {
  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const res = await getFriendList();
        console.log("fetchFriendList", res);
        setGroupList(res);
      } catch (error) {
        console.log("fetchFriendList", error);
      }
    };
    fetchFriendList();
  }, []);

  return (
    <div className="flex-1">
      <div className="bg-white border border-l-0 border-gray-300 p-4 font-[500] flex items-center">
        <FaUsers color="#5c6b82" className="w-6 h-6" />
        <span className="ml-2">Danh sách nhóm</span>
      </div>
      <div className="px-4 pt-4 text-sm font-[600]">
        Nhóm và cộng đồng ({groupList.length})
      </div>
      <div className="overflow-y-auto bg-white mx-4 rounded-md mt-4 h-[calc(100vh-7rem)]">
        {groupList.map((item) => (
          <div
            key={item.userID}
            className="relative flex px-4 py-1 items-center border-b border-gray-300"
          >
            <img
              src={item.avatar}
              className="w-12 h-12 rounded-full object-cover border border-gray-600"
              alt={item.name}
            />
            <span className="ml-2 w-full py-5">{item.fullName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupList;
