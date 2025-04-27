import React from "react";

interface UnconnectButtonProps {
  username: string;
  id: number;
}

const UnconnectButton: React.FC<UnconnectButtonProps> = ({ username, id }) => {
  const handleClick = () => {
    const userConfirmed = window.confirm(
      `Are you sure you want to disconnect with ${username}?`
    );

    if (!userConfirmed) {
      return;
    }

    const disconnectUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/connections/delete`,
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
          console.error("Error disconnecting:", errorData);
          alert("Failed to disconnect");
          return;
        }

        window.location.reload();
      } catch (error) {
        console.error("Error during fetch:", error);
        alert("Failed to disconnect");
      }
    };

    disconnectUser();
  };

  return (
    <button className="btn btn-red" onClick={handleClick}>
      Unconnect
    </button>
  );
};

export default UnconnectButton;
