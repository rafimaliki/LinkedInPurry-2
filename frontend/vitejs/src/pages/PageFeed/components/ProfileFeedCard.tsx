import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

interface ProfileFeedCardProps {
    id: number;
    username: string;
    profile_photo: string;
    connection_count: number;
    isAuthenticated: boolean;
}

const ProfileFeedCard: React.FC<ProfileFeedCardProps> = ({
    id,
    username,
    profile_photo,
    connection_count,
    isAuthenticated,
}) => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
        navigate(`/profile/user/${id}`);
    };

    return (
        <div className="h-[50vh] bg-white flex flex-col rounded-lg border border-neutral-300">
            <div className="h-[20%] rounded-t-lg bg-gradient-to-r from-[#A0B4B7] from-40% via-[#CDDBDD] via-70% to-[#C0D4D7] to-80%">
                {profile_photo ? (
                    <img
                        className=" w-[110px] h-[110px] top-[1rem] left-[7.4rem] lg:w-[70px] lg:h-[70px] rounded-full relative lg:top-[1rem] lg:left-[4.3rem] border-4 border-white"
                        src={profile_photo}
                        alt={`${username}'s profile`}
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faUserCircle}
                        className="text-[110px] left-[7.2rem] top-[1rem] lg:text-[70px] text-black border-4 bg-white rounded-full border-white relative lg:top-[1rem] lg:left-[4.3rem]"
                    />
                )}
            </div>
            <div className="h-[60%] pt-10">
                {isAuthenticated ? (
                    <div className="flex flex-col items-center px-6 py-2">
                        <h1 className="text-base font-bold cursor-pointer hover:underline" onClick={handleProfileClick}>
                            Hi, {username}!
                        </h1>
                        <p className="text-gray-600 text-base">{connection_count} connections</p>
                    </div>
                ) : (
                    <h1 className="text-l mt-5 lg:mt-1 text-center font-bold cursor-pointer hover:underline" onClick={handleProfileClick}>
                        Hi, Guest!
                    </h1>
                )}
            </div>
        </div>
    );
};

export default ProfileFeedCard;