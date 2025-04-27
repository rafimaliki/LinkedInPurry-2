import React, { useState, useEffect } from "react";
import UserCard from "../../components/user/UserCard";
import SearchBar from "../../components/SearchBar";
import RequestAcceptButton from "../../components/buttons/RequestAcceptButton";
import RequestDeclineButton from "../../components/buttons/RequestDeclineButton";

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

const PageUserConnectionRequest: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/connections/reqlist?search_term=${searchTerm}`,
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
  }, [searchTerm]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center overflow-y-auto">
      <div className="flex justify-center gap-4 mt-4">
        <div className="w-[50rem] min-h-[5rem] h-fit bg-white rounded-lg border border-neutral-300 overflow-hidden py-2 mb-4">
          {users && (
            <SearchBar
              setSearchTerm={setSearchTerm}
              title={`${users.length} Requests`}
            />
          )}
          {users?.map((user, index) => (
            <UserCard
              key={user.id}
              {...user}
              border={index < users.length - 1}
              buttons={
                <>
                  <RequestAcceptButton username={user.username} id={user.id} />
                  <RequestDeclineButton username={user.username} id={user.id} />
                </>
              }
            />
          ))}
          {users?.length === 0 && (
            <p className="font-semibold text-center py-6">Not found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageUserConnectionRequest;
