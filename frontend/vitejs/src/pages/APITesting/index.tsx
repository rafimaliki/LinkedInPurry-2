import React from "react";

const APITesting: React.FC = () => {
  const handleTestAPI = () => {
    const callAPI = async () => {
      try {
        // const response = await fetch(
        //   "http://localhost:3000/api/feed?limit=5&cursor=5",
        //   {
        //     method: "GET",
        //     credentials: "include",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );
        const response = await fetch("http://localhost:3000/api/chat/list", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // const response = await fetch("http://localhost:3000/api/feed", {
        //   method: "POST",
        //   credentials: "include",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: {
        //     content: "Hello, world!",
        //   },
        // });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData.message);
          console.error("Status code:", response.status);
          return;
        }

        const responseData = await response.json();
        console.log("API call successful:", responseData);
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    callAPI();
  };

  return (
    <div className="min-h-screen w-full p-5">
      <h1>API Testing Page</h1>
      <button className="btn btn-green mt-5" onClick={handleTestAPI}>
        Test API
      </button>
    </div>
  );
};

export default APITesting;
