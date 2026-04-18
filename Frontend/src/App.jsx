import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./store/store";

import Index from "./Index";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Matches  from "./components/Matches";
import {ConnectionRequest} from "./components/ConnectionRequest";
import Premium from "./components/Premium";
import Chat from "./components/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatUserProfile from "./components/ChatUserProfile";

const App = () => {
  return (
    <Provider store={store}>
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "",
          style: {
            background: "#09090b", // Matches our dark background
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "9999px", // Sleek pill shape
            padding: "12px 24px",
            boxShadow: "0 4px 20px rgba(34, 211, 238, 0.15)", // Subtle Cyan Glow
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            iconTheme: {
              primary: "#22d3ee", // Cyan success icon
              secondary: "#09090b",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444", // Red error icon
              secondary: "#fff",
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Public Routes - No Navbar, No Auth Checks */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* App Layout - Includes Navbar and Footer */}
          <Route path="/" element={<Index />}>
            {/* Protected Routes - Must be logged in */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/matches" element={<Matches />} />
              {/* <Route path="/requests" element={<ConnectionRequest />} /> */}
              <Route path="/premium" element={<Premium />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
              <Route path="/user/:id" element={<ChatUserProfile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
