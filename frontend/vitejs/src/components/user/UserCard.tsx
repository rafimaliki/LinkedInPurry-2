import React from "react";
import { useNavigate } from "react-router-dom";

interface UserCardProps {
  id: number;
  username: string;
  email: string;
  full_name: string;
  work_history: string;
  skills: string;
  profile_photo_path: string;
  connection_status: string;
  buttons?: React.ReactNode;
  border: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  username,
  email,
  full_name,
  work_history,
  skills,
  profile_photo_path,
  connection_status,
  buttons,
  border,
}) => {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate(`/profile/user/${id}`);
  };

  return (
    <div
      className={`w-[50rem] h-fit bg-white flex px-4 py-3 pr-0 cursor-default ${
        border ? "border-b border-neutral-300" : ""
      }`}
    >
      <a
        className="text-xl font-bold cursor-pointer hover:underline"
        onClick={handleProfile}
      >
        <div className=" w-16 h-16">
          <img
            src={profile_photo_path}
            alt={`${username}'s profile`}
            className="w-16 h-16 rounded-full mt-2 object-cover aspect-square"
          />
        </div>
      </a>
      <div className="mx-4 w-full flex justify-between">
        <div>
          <a
            className="text-xl font-bold cursor-pointer hover:underline"
            onClick={handleProfile}
          >
            {username}
          </a>
          <p className="font-semibold">{skills}</p>
          <p className="text-neutral-500">{work_history}</p>
        </div>
        {buttons && <div className="flex gap-2 mt-2 ">{buttons}</div>}
      </div>
    </div>
  );
};

export default UserCard;
