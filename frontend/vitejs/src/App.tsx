import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import PageLogin from "./pages/PageLogin";
import PageRegister from "./pages/PageRegister";
import PageUserProfile from "./pages/PageUserProfile";
import PageFeed from "./pages/PageFeed";
import PageUsers from "./pages/PageUsers";
import PageUserConnectionRequest from "./pages/PageUserConnectionRequest";
import PageUserConnections from "./pages/PageUserConnections";
import PageChat from "./pages/PageChat";
import NotFound from "./pages/NotFound";
// import APITesting from "./pages/APITesting";
import PageNotifications from "./pages/PageNotifications";

const Pages = [
  { path: "/login", component: PageLogin },
  { path: "/register", component: PageRegister },
  { path: "/profile/user/:user_id", component: PageUserProfile },
  { path: "/feed", component: PageFeed },
  { path: "/users", component: PageUsers },
  { path: "/chat", component: PageChat },
  { path: "/connections/request", component: PageUserConnectionRequest },
  { path: "/connections/user/:user_id", component: PageUserConnections },
  // { path: "/APITesting", component: APITesting },
  { path: "/chat", component: PageChat },
  { path: "/notifications", component: PageNotifications },
  { path: "*", component: NotFound },
];

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        {Pages.map((page, index) => (
          <Route key={index} path={page.path} element={<page.component />} />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
