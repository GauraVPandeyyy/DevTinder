import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./store/store";

import Index from "./Index";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import { Connections } from "./components/Connections";
import { ConnectionRequest } from "./components/ConnectionRequest";
import Premium from "./components/Premium";
import Chat from "./components/Chat";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Provider store={store}>
      <Toaster
  position="top-center"
  gutter={12}
  containerStyle={{
    top: 20,
  }}
  toastOptions={{
    duration: 4000,
    style: {
      background: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      border: "1px solid hsl(var(--border))",
      padding: "12px 16px",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      fontSize: "14px",
    },

    success: {
      iconTheme: {
        primary: "#22c55e",
        secondary: "white",
      },
      style: {
        border: "1px solid rgba(34,197,94,0.3)",
        background: "rgba(34,197,94,0.08)",
      },
    },

    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "white",
      },
      style: {
        border: "1px solid rgba(239,68,68,0.3)",
        background: "rgba(239,68,68,0.08)",
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
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<ConnectionRequest />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;