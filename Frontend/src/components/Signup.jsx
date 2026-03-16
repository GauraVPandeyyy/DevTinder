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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import api from "@/services/api";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [email, setEmail] = useState("gaurav@gmail.com");
  const [password, setPassword] = useState("Gaurav@123");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const SignupHander = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/signup", {
        email,
        password,
        firstName,
        lastName,
      });
      dispatch(setUser(res.data.user));
      navigate("/profile");
    } catch (error) {
      const errData = error?.response?.data;
      setError(
        errData?.message || errData?.errors?.[0]?.msg || "something went wrong",
      );
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create a new Account</CardTitle>
          {/* <CardDescript     */}
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Tony"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Stark"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            { error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            onClick={SignupHander}
            className="w-full cursor-pointer"
          >
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
