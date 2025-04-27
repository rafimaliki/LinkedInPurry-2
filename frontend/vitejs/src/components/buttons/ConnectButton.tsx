import React, { useState } from "react";

interface ConnectButtonProps {
  username: string;
  id: number;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ username, id }) => {
  const [hasClicked, setHasClicked] = useState(false);

  const handleClick = () => {
    if (hasClicked) {
      return;
    }
    const userConfirmed = window.confirm(
      `Are you sure you want to connect with ${username}?`
    );

    if (!userConfirmed) {
      return;
    }

    const connectUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/connections/create`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to_id: id,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error creating connection:", errorData);
          alert("Failed to connect");
          return;
        } else {
          setHasClicked(true);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
        alert("Failed to connect");
      }
    };

    connectUser();
  };

  return (
    <button
      className={`btn ${hasClicked ? "btn-inactive" : "btn-blue"}`}
      onClick={handleClick}
    >
      {hasClicked ? "Pending" : "Connect"}
    </button>
  );
};

export default ConnectButton;
