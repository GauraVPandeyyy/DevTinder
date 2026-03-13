import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UserCard({ user }) {

    if (!user) return null;
  const { firstName, lastName, age, gender, about, photoUrl, skills } = user;

  return (
    user && (
      <Card className="relative mx-auto w-full max-w-sm pt-0 mt-10 shadow-2xl">
        <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
        <img
          src={photoUrl}
          alt="profile photo"
          className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
        />
        <CardHeader>
          <CardTitle>{firstName} {" "} {lastName || ""}</CardTitle>
          <CardDescription>
            {age ? age : ""} {gender ? ", " + gender : ""}
          </CardDescription>
          <CardDescription>
            {about}
          </CardDescription>
          <CardDescription>
            {skills && skills.map((key,id)=>{
                <span key={id}>{key}</span>
            })}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center gap-4">
          <Button className="bg-red-400">Reject</Button>
          <Button className="bg-green-400">Interest</Button>
        </CardFooter>
      </Card>
    )
  );
}
