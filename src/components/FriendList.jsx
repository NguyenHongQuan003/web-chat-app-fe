// import React from "react";
import { useEffect, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { getFriendList } from "../services/apiFunctionFriend";
import { data } from "react-router-dom";

const FriendList = () => {
  const list = [
    {
      id: 1,
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
      status: "online",
    },
    {
      id: 2,
      name: "Jane Doe",
      avatar: "https://via.placeholder.com/150",
      status: "offline",
    },
    {
      id: 3,
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
      status: "online",
    },
    {
      id: 4,
      name: "Jane Doe",
      avatar: "https://via.placeholder.com/150",
      status: "offline",
    },
    {
      id: 5,
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
      status: "online",
    },
    {
      id: 6,
      name: "Jane Doe",
      avatar: "https://via.placeholder.com/150",
      status: "offline",
    },
    {
      id: 7,
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
      status: "online",
    },
    {
      id: 8,
      name: "Jane Doe",
      avatar: "https://via.placeholder.com/150",
      status: "offline",
    },
    {
      id: 9,
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
      status: "online",
    },
    {
      id: 10,
      name: "Jane Doe",
      avatar: "https://via.placeholder.com/150",
      status: "offline",
    },
    {
      id: 11,
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
      status: "online",
    },
    {
      id: 12,
      name: "Jane Doe",
      avatar: "https://via.placeholder.com/150",
      status: "offline",
    },
    {
      id: 13,
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
      status: "online",
    },
    {
      id: 14,
      name: "Jane Doe",
      avatar: "https://via.placeholder.com/150",
      status: "offline",
    },
    {
      id: 15,
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
      status: "online",
    },
    {
      id: 16,
      name: "Jane Doe",
      avatar: "https://via.placeholder.com/150",
      status: "offline",
    },
    {
      id: 17,
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
      status: "online",
    },
    {
      id: 18,
      name: "Jane Doe",
      avatar: "https://via.placeholder.com/150",
      status: "offline",
    },
    {
      id: 19,
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
      status: "online",
    },
  ];

  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const res = await getFriendList();
        console.log("fetchFriendList", res);
        setFriendList(res);
      } catch (error) {
        console.log("fetchFriendList", error);
      }
    };
    fetchFriendList();
  }, []);

  return (
    <div className="flex-1">
      <div className="bg-white border border-l-0 border-gray-300 p-4 font-[500] flex items-center">
        <FaUserFriends className="w-6 h-6" />
        <span className="ml-2">Danh sách bạn bè</span>
      </div>
      <div className="overflow-y-auto py-4 h-[calc(100vh-4rem)]">
        {friendList.map((item) => (
          <div key={item.id} className="flex p-2 items-center ">
            <img
              src={item.avatar}
              className="w-12 h-12 rounded-full object-cover border border-gray-600"
              alt={item.name}
            />
            <span className="ml-2 border-b border-gray-300 w-full py-5">
              {item.fullName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendList;
