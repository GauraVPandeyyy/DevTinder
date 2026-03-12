import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  console.log(user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div>This is Feed</div>
    </>
  );
};

export default Feed;
