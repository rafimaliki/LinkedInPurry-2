import React, { useState, useEffect } from "react";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useActiveUser from "../../hooks/useActiveUser";

const PageLogin: React.FC = () => {
  const [request, setRequest] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [activeUser, setActiveUser] = useActiveUser();

  const registerPushSubscription = async (user_id: number) => {
    if ("serviceWorker" in navigator) {
      try {
        const register = await navigator.serviceWorker.register("/sw.js");

        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            "BCRmKbkj9BU9RNMVWFziClYBj8bS7BS_2BAn2YUaHEJNnQGBmahYMrX9Nf3XvUbqIU475Pn4MK1JWd0o_EN3dpA",
        });

        const res = await fetch("http://localhost:3000/api/vapid/subscribe", {
          method: "POST",
          body: JSON.stringify({
            subscription: subscription,
            user_id: user_id,
          }),
          headers: {
            "content-type": "application/json",
          },
        });

        const result = await res.json();
        console.log("Push subscription registered:", result);
      } catch (error) {
        console.error("Error registering push subscription:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrUsername: request.emailOrUsername,
          password: request.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const active_user = data.body.user;
        setActiveUser(active_user);
        console.log(active_user);

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          await registerPushSubscription(active_user.id);
        } else {
          alert("Notifications are disabled for this site.");
        }

        window.location.href = "/feed";
      } else if (response.status === 404) {
        alert("User not found.");
      } else if (response.status === 401) {
        alert("Invalid credentials. Please try again.");
      } else {
        const error = await response.json();
        alert(`Failed to login: ${error.message}`);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to login. Please try again later.");
    }
  };

  if (activeUser) {
    window.location.href = "/feed";
  } else {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="w-full p-4 flex justify-between items-center">
          <div className="text-left">
            <a className="cursor-pointer flex gap-4 items-center">
              <FontAwesomeIcon
                icon={faLinkedin}
                className="text-[#0072b1] text-4xl"
              />
              <p className="text-2xl font-bold text-[#0072b1]">LinkedInPurry</p>
            </a>
          </div>
        </header>

        <main className="flex-grow flex flex-col justify-center items-center">
          <div className="bg-white shadow-lg rounded-lg p-6 w-[352px] sm:w-[400px]">
            <div className="mb-6">
              <h1 className="text-4xl font-semibold text-gray-800 text-left">
                Login
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                Stay updated on your professional world.
              </p>
            </div>
            <form
              action="/login"
              className="flex flex-col space-y-4"
              onSubmit={handleSubmit}
            >
              <input
                type="emailOrUsername"
                id="emailOrUsername"
                name="emailOrUsername"
                placeholder="Email or Username"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setRequest({ ...request, emailOrUsername: e.target.value })
                }
              />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setRequest({ ...request, password: e.target.value })
                }
              />
              <button
                type="submit"
                name="login"
                className="w-full p-3 bg-[#0072b1] text-white rounded-3xl hover:bg-[#0a66c2] transition duration-200"
              >
                Login
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New to LinkedInPurry?{" "}
                <a href="/register" className="text-[#0072b1] hover:underline">
                  Join now
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }
};

export default PageLogin;
