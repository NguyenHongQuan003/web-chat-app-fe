import { useState } from "react";
import { FaSearch, FaUserPlus, FaUsers } from "react-icons/fa";
import AddFriendModal from "./AddFriendModel";
import { isCreateGroupModalOpenState } from "../recoil/createGroupAtom";
import { useSetRecoilState } from "recoil";

const SearchTool = () => {
  const [isAddFriendModalOpen, setAddFriendModalOpen] = useState(false);
  const setCreateGroupModalOpen = useSetRecoilState(
    isCreateGroupModalOpenState
  );
  return (
    <>
      <div className="min-w-86 border border-b-0 border-gray-300 bg-white">
        {/* Search bar */}
        <div className="p-4 space-x-1 flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="px-8 text-[15px] w-full py-1.5 py rounded-md focus:outline-none focus:ring-1 focus:ring-[#0068ff] 
            placeholder:text-gray-400 placeholder:font-medium
            bg-[#ebecf0]"
            />
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600" />
          </div>

          <button
            onClick={() => setAddFriendModalOpen(true)}
            className="cursor-pointer rounded-md hover:bg-gray-200 p-2"
            title="Thêm bạn bè"
          >
            <FaUserPlus color="#5c6b82" />
          </button>
          <button
            onClick={() => setCreateGroupModalOpen(true)}
            className="cursor-pointer rounded-md hover:bg-gray-200 p-2"
            title="Tạo nhóm chat"
          >
            <FaUsers color="#5c6b82" />
          </button>
        </div>
        {/* Filter */}
        {/* <div className="text-[14px] px-4 text-gray-600 font-[600] border-b border-gray-300">
          {choices.map((choice) => (
            <button
              key={choice}
              className={isActiveFilter(choice)}
              onClick={() => setFiltered(choice)}
            >
              {choice}
            </button>
          ))}
        </div> */}

        <AddFriendModal
          isOpen={isAddFriendModalOpen}
          onClose={() => setAddFriendModalOpen(false)}
        />
      </div>
    </>
  );
};

export default SearchTool;
