import React, { useState, useEffect } from "react";
import UserCard from "../../components/user/UserCard";
import SearchBar from "../../components/SearchBar";
import ConnectButton from "../../components/buttons/ConnectButton";
import MessageButton from "../../components/buttons/MessageButton";
import PendingButton from "../../components/buttons/PendingButton";
import UnconnectButton from "../../components/buttons/UnconnectButton";

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  work_history: string;
  skills: string;
  profile_photo_path: string;
  connection_status: string;
}

const PageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/userslist?search_term=${searchTerm}&filter=${filter
            .trim()
            .toUpperCase()
            .replace(" ", "_")}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUsers(data.body);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [searchTerm, filter]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center overflow-y-auto mt-4">
      <div className="w-[50rem] min-h-[5rem] h-fit bg-white rounded-lg border border-neutral-300 overflow-hidden py-2 mb-4">
        <SearchBar
          setSearchTerm={setSearchTerm}
          filter={filter}
          setFilter={setFilter}
          title="Find users"
        />
        {users?.map((connection, index) => (
          <UserCard
            key={connection.id}
            {...connection}
            border={index < users.length - 1}
            buttons={
              <>
                {connection.connection_status === "NOT_CONNECTED" && (
                  <ConnectButton
                    username={connection.username}
                    id={connection.id}
                  />
                )}
                {connection.connection_status === "CONNECTED" && (
                  <MessageButton
                    username={connection.username}
                    id={connection.id}
                  />
                )}
                {(connection.connection_status === "WAITING_FOR_YOU" ||
                  connection.connection_status === "WAITING_FOR_THEM") && (
                  <PendingButton />
                )}
              </>
            }
          />
        ))}
        {users?.length === 0 && (
          <p className="font-semibold text-center py-6">Not found</p>
        )}
      </div>
    </div>
  );
};

export default PageUsers;
