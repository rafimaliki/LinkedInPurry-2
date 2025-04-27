import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserFriends,
  faBriefcase,
  faComment,
  faBell,
  faUser,
  faRightFromBracket,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import useActiveUser from "../hooks/useActiveUser";
import { User } from "../types/User";

const NAVBAR_ITEMS = [
  {
    text: "Home",
    icon: faHome,
    action: () => (window.location.href = `/feed`),
  },
  {
    text: "Users",
    icon: faUserFriends,
    action: () => (window.location.href = `/users`),
  },
];

const LOGGED_IN_ITEMS = (
  logoutHandler: () => Promise<void>,
  active_user: User
) => [
  {
    text: "Messaging",
    icon: faComment,
    action: () => (window.location.href = `/chat`),
  },
  {
    text: "Notifications",
    icon: faBell,
    action: () => (window.location.href = `/notifications`),
  },
  {
    text: "Me",
    icon: faUser,
    action: () => (window.location.href = `/profile/user/${active_user.id}`),
  },
  {
    text: "Logout",
    icon: faRightFromBracket,
    action: logoutHandler,
  },
];

const LOGGED_OUT_ITEMS = [
  {
    text: "Login",
    icon: faRightFromBracket,
    action: () => (window.location.href = "/login"),
  },
];

const NO_NAVBAR_ROUTES = ["/login", "/register"];

const NavBar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeUser, setActiveUser] = useActiveUser();
  const [navItems, setNavItems] = useState<
    { text: string; icon: any; action: () => void }[]
  >([]);

  console.log(activeUser);

  const logoutHandler = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setActiveUser(null);
        window.location.href = "/login";
      } else {
        const error = await response.json();
        alert(`Failed to logout: ${error.message}`);
      }
    } catch (err) {
      console.error("Logout Error:", err);
      alert("Failed to logout. Please try again later.");
    }
  };

  useEffect(() => {
    const items = activeUser
      ? [...NAVBAR_ITEMS, ...LOGGED_IN_ITEMS(logoutHandler, activeUser)]
      : [...NAVBAR_ITEMS, ...LOGGED_OUT_ITEMS];
    setNavItems(items);
  }, [activeUser]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  if (NO_NAVBAR_ROUTES.includes(location.pathname)) return null;

  return (
    <div className="w-full h-[10vh] bg-white flex justify-between items-center px-4 border-b relative z-50">
      <a
        className="cursor-pointer flex gap-4 items-center"
        onClick={() => (window.location.href = "/feed")}
      >
        <FontAwesomeIcon
          icon={faLinkedin}
          className="text-[#0072b1] text-4xl"
        />
        <p className="text-2xl font-bold text-[#0072b1] hidden sm:block">
          LinkedInPurry
        </p>
      </a>

      <div className="hidden md:flex items-center gap-5">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="flex flex-col items-center justify-center cursor-pointer w-[5.5rem]"
          >
            <FontAwesomeIcon
              icon={item.icon}
              className="text-2xl text-neutral-500 hover:text-neutral-900"
            />
            <p className="text-neutral-500 text-xs sm:text-base hover:text-neutral-900">
              {item.text}
            </p>
          </button>
        ))}
      </div>

      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu}>
          <FontAwesomeIcon
            icon={isMenuOpen ? faTimes : faBars}
            className="text-2xl text-neutral-500 hover:text-neutral-900"
          />
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-[8vh] left-0 w-full bg-white flex flex-col items-center border-t z-50">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="flex items-center justify-center w-full py-4 border-b"
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="text-2xl text-neutral-500 hover:text-neutral-900"
              />
              <p className="ml-4 text-neutral-500 text-base hover:text-neutral-900">
                {item.text}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavBar;
