import { BrowserRouter, Routes,Route } from "react-router-dom";
import Index from "./Index";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import store from "./store/store";
const App = () => {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  );
};

export default App;
