import { FaUserFriends, FaUserPlus, FaUsers, FaUsersCog } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { typeContentState } from "../recoil/leftPanelAtom";

const SidebarContact = () => {
  const [typeContent, setTypeContent] = useRecoilState(typeContentState);
  const handleClick = (id) => {
    setTypeContent({
      contentName: id,
    });
  };
  const menuItems = [
    {
      id: "friends",
      icon: FaUserFriends,
      label: "Danh sách bạn bè",
    },
    {
      id: "groups",
      icon: FaUsers,
      label: "Danh sách nhóm",
    },
    {
      id: "friendRequests",
      icon: FaUserPlus,
      label: "Lời mời kết bạn",
    },
    {
      id: "groupInvites",
      icon: FaUsersCog,
      label: "Lời mời vào nhóm và cộng đồng",
    },
  ];

  return (
    <div className="bg-white border-r min-w-86 max-w-86 border-gray-300 h-full">
      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`${
              typeContent.contentName === item.id
                ? "bg-blue-100"
                : "hover:bg-gray-100"
            } flex items-center px-4 py-3 cursor-pointer`}
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50">
              <item.icon className="text-blue-600 w-6 h-6" />
            </div>
            <span className="ml-3">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarContact;
