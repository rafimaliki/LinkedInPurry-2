import React from "react";
import { useNavigate } from "react-router-dom";
import ConnectButton from "../../../components/buttons/ConnectButton";
import UnconnectButton from "../../../components/buttons/UnconnectButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

interface ProfileCardProps {
  id: number;
  username: string;
  full_name: string;
  email: string;
  profile_photo: string;
  connection_count: number;
  isOwnProfile: boolean;
  isConnected: boolean;
  isAuthenticated: boolean;
  onEditProfile: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  username,
  full_name,
  email,
  profile_photo,
  connection_count,
  isOwnProfile,
  isConnected,
  isAuthenticated,
  onEditProfile,
}) => {
  const navigate = useNavigate();

  const handleConnectionsClick = () => {
    navigate(`/connections/user/${id}`);
  };

  return (
    <div className="w-full h-fit bg-white flex flex-col">
      <div className="w-full h-[40%] bg-gradient-to-r from-[#A0B4B7] from-40% via-[#CDDBDD] via-70% to-[#C0D4D7] to-80%">
        {profile_photo ? (
          <img
            className="w-[130px] h-[130px] top-[4rem] left-5 lg:w-[160px] lg:h-[160px] rounded-full relative top-[4rem] left-5 border-4 border-white"
            src={profile_photo}
            alt={`${username}'s profile`}
          />
        ) : (
          <FontAwesomeIcon
            icon={faUserCircle}
            className="text-[160px] text-black border-4 bg-white rounded-full border-white relative top-[4rem] left-5"
          />
        )}
      </div>
      <div className="w-full h-[60%] pt-16 px-6">
        <div className="flex flex-row gap-2">
          <h1 className="text-2xl font-bold">{username}</h1>
          <p className="text-gray-600 text-xl flex items-end">{email}</p>
        </div>
        <p className="text-gray-600 ">{full_name}</p>
        <p
          className="text-[#0072b1] mt-1 cursor-pointer hover:underline"
          onClick={handleConnectionsClick}
        >
          {connection_count} connections
        </p>
        <div className="my-5">
          {isOwnProfile ? (
            <>
              <button
                className="h-fit px-3 py-1 mr-4 border rounded-3xl font-bold border-[#0072b1] text-[#0072b1] hover:bg-[#0072b1] hover:text-white transition-all duration-200 ease-in-out"
                onClick={onEditProfile}
              >
                Edit profile section
              </button>
            </>
          ) : isAuthenticated ? (
            isConnected ? (
              <UnconnectButton username={username} id={id} />
            ) : (
              <ConnectButton username={username} id={id} />
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
