import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/services/api";
import { removeFeed } from "@/store/feedSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export function UserCard({ user }) {
  if (!user) return null;
  const { _id, firstName, lastName, age, gender, about, photoUrl, skills } =
    user;
  const dispatch = useDispatch();
  const handleSendRequest = async (status, _id) => {
    try {
      await api.post(`/request/send/${status}/${_id}`, {});
      dispatch(removeFeed(_id));
      toast.success(firstName + " is market as " + status + " successfully!");
    } catch (error) {
      toast.error("Something went wrong", error.message);
    }
  };

  return (
    user && (
      <Card className="relative mx-auto w-full max-w-sm pt-0 mt-10 shadow-2xl">
        <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
        <img
          src={photoUrl}
          alt="profile photo"
          className="relative z-20 aspect-video w-full object-cover"
        />
        <CardHeader>
          <CardTitle>
            {firstName} {lastName || ""}
          </CardTitle>
          <CardDescription>
            {age ? age : ""} {gender ? ", " + gender : ""}
          </CardDescription>
          <CardDescription>{about}</CardDescription>
          <CardDescription>
            {skills &&
              skills.map((key, id) => {
                <span key={id}>{key}</span>;
              })}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center gap-4">
          <Button
            className="bg-red-400"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Reject
          </Button>
          <Button
            className="bg-green-400"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interest
          </Button>
        </CardFooter>
      </Card>
    )
  );
}
