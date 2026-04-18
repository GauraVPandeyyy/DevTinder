import { configureStore } from "@reduxjs/toolkit";
import userReducer  from "./userSlice";
import feedReducer from "./feedSlice";
import matchesReducer from './matchesSlice'
import requestReducer from './RequestSlice'
const store = configureStore({
    reducer :{
        user: userReducer,
        feed : feedReducer,
        matches : matchesReducer,
    }
})

export default store;