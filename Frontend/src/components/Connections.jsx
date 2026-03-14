import api from "@/services/api";
import { addConnection } from "@/store/connectionSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const Connections = () => {
  const dispatch = useDispatch();
  const [connections, setConnections] = useState();
  const fetchConnections = async () => {
    const res = await api.get("/user/connections");
    // console.log(res);
    dispatch(addConnection(res.data.data));
    setConnections(res.data.data);
  };

  useEffect(() => {
    fetchConnections();
  }, []);
  return <div className="flex flex-col  justify-center items-center mt-10 gap-10">
    {connections &&  connections.map((connection)=> {
        return <div key={connection._id} className="flex items-center w-1/2 bg-gray-700 gap-4 p-3 rounded-2xl">
            <img src={connection.photoUrl} className="w-16 h-16 rounded-full object-cover" alt="photo" />
            <div>
                <h2>{connection.firstName} {" "} {connection.lastName ? connection.lastName : ""}</h2>
                <p>{connection.age && connection.gender ? connection.age + ", "+ connection.gender : "" }</p>
                <p>{connection.about}</p>
            </div>
        </div>
    }    )}
  </div>
};
