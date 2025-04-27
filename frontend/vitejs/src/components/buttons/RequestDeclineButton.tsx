import React from "react";

interface RequestDeclineButtonProps {
  username: string;
  id: number;
}

const RequestDeclineButton: React.FC<RequestDeclineButtonProps> = ({
  username,
  id,
}) => {
  const handleClick = () => {
    const userConfirmed = window.confirm(
      `Are you sure you want to decline the connection request from ${username}?`
    );

    if (!userConfirmed) {
      return;
    }

    const declineUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/connections/decline`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from_id: id,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error declining connection request:", errorData);
          alert("Failed to decline the connection request.");
          return;
        }

        window.location.reload();
      } catch (error) {
        console.error("Error during fetch:", error);
        alert("Failed to decline the connection request.");
      }
    };

    declineUser();
  };

  return (
    <button className="btn btn-red" onClick={handleClick}>
      Decline
    </button>
  );
};

export default RequestDeclineButton;
