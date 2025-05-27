// import React from "react";
import { useEffect, useState } from "react";
import { FaTrash, FaUserFriends } from "react-icons/fa";
import { deleteFriend, getFriendList } from "../services/friendService";
import { useRecoilValue } from "recoil";
import { onlineUsersState } from "../recoil/onlineUsersAtom";
import { toast } from "react-toastify";

// Danh sách bạn bè lấy trạng thái accept

const FriendList = () => {
  const [friendList, setFriendList] = useState([]);
  const onlineUsers = useRecoilValue(onlineUsersState);
  // const list = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "online",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "offline",
  //   },
  //   {
  //     id: 3,
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "online",
  //   },
  //   {
  //     id: 4,
  //     name: "Jane Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "offline",
  //   },
  //   {
  //     id: 5,
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "online",
  //   },
  //   {
  //     id: 6,
  //     name: "Jane Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "offline",
  //   },
  //   {
  //     id: 7,
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "online",
  //   },
  //   {
  //     id: 8,
  //     name: "Jane Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "offline",
  //   },
  //   {
  //     id: 9,
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "online",
  //   },
  //   {
  //     id: 10,
  //     name: "Jane Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "offline",
  //   },
  //   {
  //     id: 11,
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "online",
  //   },
  //   {
  //     id: 12,
  //     name: "Jane Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "offline",
  //   },
  //   {
  //     id: 13,
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "online",
  //   },
  //   {
  //     id: 14,
  //     name: "Jane Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "offline",
  //   },
  //   {
  //     id: 15,
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "online",
  //   },
  //   {
  //     id: 16,
  //     name: "Jane Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "offline",
  //   },
  //   {
  //     id: 17,
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "online",
  //   },
  //   {
  //     id: 18,
  //     name: "Jane Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "offline",
  //   },
  //   {
  //     id: 19,
  //     name: "John Doe",
  //     avatar: "https://via.placeholder.com/150",
  //     status: "online",
  //   },
  // ];

  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const res = await getFriendList();
        // console.log("fetchFriendList", res);
        setFriendList(res);
      } catch (error) {
        console.log("fetchFriendList", error);
      }
    };
    fetchFriendList();
  }, []);

  const handleRemoveFriend = async (friendID) => {
    try {
      await deleteFriend(friendID);
      toast.success("Xóa bạn thành công");
      setFriendList((prev) =>
        prev.filter((friend) => friend.userID !== friendID)
      );
    } catch (error) {
      console.log("handleRemoveFriend", error);
    }
  };

  return (
    <div className="flex-1">
      <div className="bg-white border border-l-0 border-gray-300 p-4 font-[500] flex items-center">
        <FaUserFriends color="#5c6b82" className="w-6 h-6" />
        <span className="ml-2">Danh sách bạn bè</span>
      </div>
      <div className="px-4 pt-4 text-sm font-[600]">
        Bạn bè ({friendList.length})
      </div>
      <div className="overflow-y-auto bg-white mx-4 rounded-md mt-4 h-[calc(100vh-7rem)]">
        {friendList.map((item) => (
          <div
            key={item.userID}
            className="relative flex px-4 py-1 items-center border-b border-gray-300"
          >
            <img
              src={item.avatar}
              className="w-12 h-12 rounded-full object-cover border border-gray-600"
              alt={item.name}
            />
            <div
              className={`absolute ${
                onlineUsers.has(item.userID) ? "bg-green-500" : "bg-red-500"
              } left-13 bottom-3 w-4 h-4 border-2 border-white rounded-full `}
            ></div>
            <span className="ml-2 w-full py-5">{item.fullName}</span>
            <div
              onClick={() => handleRemoveFriend(item.userID)}
              className="ml-auto"
            >
              <FaTrash color="#5c6b82" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendList;
