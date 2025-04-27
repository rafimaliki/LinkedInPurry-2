import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectButton from '../../../components/buttons/ConnectButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

interface RecommendationFeedCardProps {
    id: number;
    username: string;
    profile_photo: string;
    isAuthenticated: boolean;
}

const RecommendationFeedCard: React.FC<RecommendationFeedCardProps> = ({
    id,
    username,
    profile_photo,
    isAuthenticated,
}) => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate(`/profile/user/${id}`);
    };

    return (
        <div className="w-full h-fit p-4">
            <div className="flex flex-row">
                {profile_photo ? (
                    <img
                        className="w-[80px] h-[80px] rounded-full"
                        src={profile_photo}
                        alt={`${username}'s profile`}
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faUserCircle}
                        className="text-[80px] text-black bg-white rounded-full"
                    />
                )}
                <div className="flex flex-col justify-center items-center ml-2">
                    <h2
                        className="text-lg font-bold cursor-pointer hover:underline"
                        onClick={handleProfileClick}
                    >
                        {username}
                    </h2>
                    {isAuthenticated && (
                        <div className="flex justify-center items-center ml-2">
                            <ConnectButton username={username} id={id} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendationFeedCard;