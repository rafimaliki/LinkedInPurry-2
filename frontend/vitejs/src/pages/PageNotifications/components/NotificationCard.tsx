import React from "react";

interface NotificationCardProps {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  sender: {
    id: number;
    username: string;
    profile_photo: string;
  };
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  type,
  message,
  timestamp,
  sender,
}) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg border border-neutral-300 mb-2">
      <div className="flex flex-row gap-4">
        <img
          src={sender.profile_photo}
          alt={`${sender.username}'s profile`}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-semibold">{sender.username}</p>
          <p className="text-neutral-600">{message}</p>
          <p className="text-neutral-400 text-sm">{new Date(timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;