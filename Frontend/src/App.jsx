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
        toastOptions={{
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
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