import React from "react";

interface RequestAcceptButtonProps {
  username: string;
  id: number;
}

const RequestAcceptButton: React.FC<RequestAcceptButtonProps> = ({
  username,
  id,
}) => {
  const handleClick = () => {
    const userConfirmed = window.confirm(
      `Are you sure you want to accept the connection request from ${username}?`
    );

    if (!userConfirmed) {
      return;
    }

    const acceptUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/connections/accept`,
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
          console.error("Error accepting connection request:", errorData);
          alert("Failed to accept the connection request.");
          return;
        }

        window.location.reload();
      } catch (error) {
        console.error("Error during fetch:", error);
        alert("Failed to accept the connection request.");
      }
    };

    acceptUser();
  };

  return (
    <button className="btn btn-green" onClick={handleClick}>
      Accept
    </button>
  );
};

export default RequestAcceptButton;
