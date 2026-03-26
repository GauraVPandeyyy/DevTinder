import api from "@/services/api";
import { addConnection } from "@/store/connectionSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

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

  if (connections && connections.length == 0) {
    return <p className="mx-auto pt-20">NO Connections</p>;
  }
  return <div className="flex flex-col  justify-center items-center mt-10 gap-10">
    {connections &&  connections.map((connection)=> {
      const{firstName , lastName, age, gender , about , photoUrl} = connection
        return <div key={connection._id} className="flex items-center w-1/2 bg-gray-700 gap-4 p-3 rounded-2xl">
            <img src={photoUrl} className="w-16 h-16 rounded-full object-cover" alt="photo" />
            <div>
                <h2>{firstName} {" "} {lastName ? lastName : ""}</h2>
                <p>{age && gender ? age + ", "+ gender : "" }</p>
                <p>{about}</p>
            </div>
            <Link to={`/chat/${connection._id}`} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Message</Link>
        </div>
    }    )}
  </div>
};
