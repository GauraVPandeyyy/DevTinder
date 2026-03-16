import api from "@/services/api";
import { addRequest } from "@/store/RequestSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export const ConnectionRequest = () => {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState();
  const fetchRequests = async () => {
    const res = await api.get("/user/request/received");
    console.log(res);
    dispatch(addRequest(res.data.data));
    setRequests(res.data.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

const handleRequest = async(status, _id) => {
    try {
      const res =await api.post(`/request/review/${status}/${_id}`,{})
      toast.success(firstName+ " is market as " + status +" successfully!");
    } catch (error) {
      toast.error("Something went wrong", error.message)
    }
  }

  if (requests && requests.length == 0) {
    return <p className="mx-auto pt-20 w-screen">NO Requests</p>;
  }
  return (
    <div className="flex flex-col  justify-center items-center mt-10 gap-10">
      {requests &&
        requests.map((request) => {
            const{firstName , lastName, age, gender , about , photoUrl} = request.fromUserId
          return (
            <div
              key={request._id}
              className="flex items-center w-1/2 bg-gray-700 gap-4 p-3 rounded-2xl"
            >
              <img
                src={photoUrl}
                className="w-16 h-16 rounded-full object-cover"
                alt="photo"
              />
              <div>
                <h2>
                  {firstName} {lastName ? lastName : ""}
                </h2>
                <p>
                  {age && gender
                    ? age + ", " + gender
                    : ""}
                </p>
                <p>{about}</p>
              </div>
                <button onClick={()=>handleRequest("accepted", request._id)} className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                  Accept
                </button>
                <button onClick={()=>handleRequest("rejected", request._id)} className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                  Reject
                </button>
            </div>
          );
        })}
    </div>
  );
};
