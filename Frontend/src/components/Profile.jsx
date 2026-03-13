
import React, { useEffect, useState } from "react";
import { UserCard } from "./userCard";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api";
import { setUser } from "@/store/userSlice";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);
 
  


  return (
    user && 
      <EditProfile user={user} />
  );
};

export default Profile;
