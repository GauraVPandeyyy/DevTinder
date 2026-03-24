import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./Index";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import store from "./store/store";
import Feed from "./components/Feed";
import { Toaster } from "react-hot-toast";
import { Connections } from "./components/Connections";
import { ConnectionRequest } from "./components/ConnectionRequest";
import Signup from "./components/Signup";
import Premium from "./components/premium";
const App = () => {
  return (
    <Provider store={store}>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}>
            <Route path="/" element={<Feed />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/requests" element={<ConnectionRequest />} />
            <Route path="/premium" element={<Premium />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
