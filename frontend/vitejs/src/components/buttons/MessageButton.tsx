import React from "react";

import getAuthToken from "../../auth/token";

interface MessageButtonProps {
  username: string;
  id: number;
}

const MessageButton: React.FC<MessageButtonProps> = ({ username, id }) => {
  const handleClick = () => {
    // alert(`Messaging with {username: ${username}, id: ${id}}`);
    window.location.href = `/chat`;
    console.log(getAuthToken());
  };

  return (
    <button className="btn btn-blue" onClick={handleClick}>
      Message
    </button>
  );
};

export default MessageButton;
