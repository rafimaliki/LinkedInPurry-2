interface Notification {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  sender: {
    id: number;
    username: string;
    profile_photo: string;
  };
}

const MockNotifications: Notification[] = [
  {
    id: 1,
    type: "message",
    message: "You have a new message from John Doe",
    timestamp: new Date().toISOString(),
    sender: {
      id: 1,
      username: "John Doe",
      profile_photo: "https://randomuser.me/api/portraits/men/1.jpg",
    },
  },
  {
    id: 2,
    type: "post",
    message: "John Doe has made a new post",
    timestamp: new Date().toISOString(),
    sender: {
      id: 1,
      username: "John Doe",
      profile_photo: "https://randomuser.me/api/portraits/men/1.jpg",
    },
  },
  {
    id: 3,
    type: "message",
    message: "You have a new message from Jane Smith",
    timestamp: new Date().toISOString(),
    sender: {
      id: 2,
      username: "Jane Smith",
      profile_photo: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  },
];

export default MockNotifications;