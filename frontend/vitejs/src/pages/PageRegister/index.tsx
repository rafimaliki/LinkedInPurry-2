import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import useActiveUser from "../../hooks/useActiveUser";

const PageRegister: React.FC = () => {
  const [activeUser, setActiveUser] = useActiveUser();

  const [request, setRequest] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    confirm_password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (request.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (request.password !== request.confirm_password) {
      alert("Password and confirm password do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: request.username,
          email: request.email,
          fullname: request.fullname,
          password: request.password,
        }),
      });

      if (response.ok) {
        window.location.href = "/login";
      } else if (response.status === 430) {
        alert("user already exists.");
      } else {
        const error = await response.json();
        alert(`failed to register: ${error.message}`);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to register. Please try again later.");
    }
  };

  if (activeUser) {
    window.location.href = "/feed";
  } else {
    return (
      // check if the user is already logged in
      <div className="min-h-screen flex flex-col items-center">
        {/* Header */}
        <header className="w-full p-4 flex flex-col justify-start mb-8">
          <div className="text-3xl font-bold text-[#0072b1] ml-52">
            <a className="cursor-pointer flex gap-4 items-center">
              <FontAwesomeIcon
                icon={faLinkedin}
                className="text-[#0072b1] text-4xl"
              />
              <p className="text-2xl font-bold text-[#0072b1]">LinkedInPurry</p>
            </a>
          </div>
          <h1 className="text-3xl text-gray-700 mt-4 text-center">
            Make the most of your professional life
          </h1>
        </header>

        {/* Register Form */}
        <form
          className="w-full max-w-[28rem] bg-white shadow-md rounded-2xl p-8"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                onChange={(e) =>
                  setRequest({ ...request, username: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                onChange={(e) =>
                  setRequest({ ...request, email: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="fullname"
                className="block text-gray-700 font-medium"
              >
                Fullname
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                onChange={(e) =>
                  setRequest({ ...request, fullname: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                onChange={(e) =>
                  setRequest({ ...request, password: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="block text-gray-700 font-medium"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                onChange={(e) =>
                  setRequest({ ...request, confirm_password: e.target.value })
                }
              />
            </div>

            <div>
              <button
                type="submit"
                name="register"
                className="w-full bg-[#0072b1] text-white py-2 rounded-3xl hover:bg-[#0a66c2] transition duration-200"
              >
                Register
              </button>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-4">
            Already on LinkedInPurry?{" "}
            <a href="/login" className="text-[#0072b1] hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
    );
  }
};

export default PageRegister;
