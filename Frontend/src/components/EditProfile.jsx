import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { UserCard } from "./UserCard";
import api from "@/services/api";
import toast from "react-hot-toast";
import { setUser } from "@/store/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [age, setAge] = useState(user?.age);
  const [gender, setGender] = useState(user?.gender);
  const [about, setAbout] = useState(user?.about);
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const previewUser = { firstName, lastName, age, gender, about, photoUrl };

  const EditHander = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch("/profile/edit", {
        firstName,
        lastName,
        age,
        about,
        gender,
        photoUrl,
      });

      setError("");
      dispatch(setUser(res.data.data));
      toast.success("Profile updated successfully!");
    } catch (error) {
      const errData = error?.response?.data;
      setError(
        errData?.message || errData?.errors?.[0]?.msg || "something went wrong",
      );
    }
  };
  return (
    <div className="flex flex-col sm:flex-row justify-center items-start gap-10 p-10">
      <Card className="max-w-1/2">
        <CardHeader>
          <CardTitle>Edit your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-2">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError("");
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  // placeholder="m@example.com"
                  // required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  // placeholder="m@example.com"
                  // required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={gender} // Ye state se linked hai
                  onValueChange={(value) => {
                    setGender(value); // Shadcn mein 'value' direct milti hai, e.target.value nahi
                    setError("");
                  }}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Select a gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Gender</SelectLabel>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Field>
                  <FieldLabel htmlFor="about">About</FieldLabel>
                  <Textarea
                    id="about"
                    type="textArea"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </Field>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="photoUrl">Photo Url</Label>
                <Input
                  id="photoUrl"
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  // placeholder="m@example.com"
                  // required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            onClick={EditHander}
            className="w-full cursor-pointer"
          >
            Save
          </Button>
        </CardFooter>
      </Card>

      <UserCard user={previewUser} />
    </div>
  );
};

export default EditProfile;
