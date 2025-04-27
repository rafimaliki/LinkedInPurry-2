import React from "react";
import NotificationCard from "./components/NotificationCard";
import MockNotifications from "./MockNotifications";
import useActiveUser from "../../hooks/useActiveUser";

const PageNotifications: React.FC = () => {
  const [notifications, setNotifications] =
    React.useState<Notification[]>(MockNotifications);
  const [activeUser] = useActiveUser();

  if (!activeUser) {
    window.location.href = "/notfound";
  } else {
    return (
      <div className="min-h-screen w-full flex flex-col items-center overflow-y-auto py-5">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <div className="w-full max-w-[600px]">
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} {...notification} />
          ))}
        </div>
      </div>
    );
  }
};

export default PageNotifications;
