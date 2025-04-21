// import React from "react";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { getMyGroups } from "../services/groupService";

// Danh sách bạn bè lấy trạng thái accept

const GroupList = () => {
  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    const fetchMyGroupList = async () => {
      try {
        const res = await getMyGroups();
        setGroupList(res.data);
      } catch (error) {
        console.log("fetching Group list", error);
      }
    };
    fetchMyGroupList();
  }, []);

  return (
    <div className="flex-1">
      <div className="bg-white border border-l-0 border-gray-300 p-4 font-[500] flex items-center">
        <FaUsers color="#5c6b82" className="w-6 h-6" />
        <span className="ml-2">Danh sách nhóm</span>
      </div>
      <div className="px-4 pt-4 text-sm font-[600]">
        Danh sách nhóm ({groupList.length})
      </div>
      <div className="overflow-y-auto bg-white mx-4 rounded-md mt-4 h-[calc(100vh-7rem)]">
        {groupList.map((item) => (
          <div
            key={item.groupID}
            className="relative flex px-4 py-1 items-center border-b border-gray-300"
          >
            <img
              src={item.groupAvatar}
              className="w-12 h-12 rounded-full object-cover border border-gray-600"
              alt={item.groupName}
            />
            <span className="ml-2 w-full py-5">{item.groupName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupList;
