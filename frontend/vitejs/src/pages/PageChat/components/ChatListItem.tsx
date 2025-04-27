import React from "react";

interface ChatListItemProps {
  username: string;
  user_id: number;
  picture: string;
  lastMessage: string;
  date: string;
  isActive: boolean;
  setActiveChatId: React.Dispatch<React.SetStateAction<number | null>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

const formatDaysAgo = (dateString: string) => {
  const inputDate = new Date(dateString);
  const today = new Date();

  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const timeDifference = today.getTime() - inputDate.getTime();
  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  if (daysAgo === 0) {
    return "Today";
  } else if (daysAgo > 0) {
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  } else {
    return "";
  }
};

const ChatListItem: React.FC<ChatListItemProps> = ({
  username,
  user_id,
  picture,
  lastMessage,
  date,
  isActive,
  setActiveChatId,
  setUsername,
}) => {
  return (
    <div
      className={`relative h-24 w-full cursor-pointer border-r flex items-center p-2 pl-0 border-b pr-2 hover:bg-neutral-100 ${
        isActive ? "bg-neutral-200" : ""
      }`}
      onClick={() => {
        setActiveChatId(user_id);
        setUsername(username);
      }}
    >
      {isActive ? (
        <div className="absolute bg-[#0072b1] w-[0.3rem] h-16"></div>
      ) : null}
      <div className="w-12 aspect-square rounded-full ml-2 overflow-hidden border bg-neutral-100">
        <img src={picture} alt="profile" className="w-full h-full " />
      </div>
      <div className="ml-2 w-[80%] ">
        <div className="flex justify-between ">
          <p className="font-semibold text-neutral-600 ">{username}</p>
          <p className="text-neutral-600">{formatDaysAgo(date)}</p>
        </div>
        <p className="text-neutral-500 truncate w-full">
          {!isActive ? lastMessage : "..."}
        </p>
      </div>
    </div>
  );
};

export default ChatListItem;
