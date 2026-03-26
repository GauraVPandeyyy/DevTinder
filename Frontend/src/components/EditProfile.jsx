import { useState } from "react";
import { useDispatch } from "react-redux";
import { Loader2, Briefcase, User as UserIcon } from "lucide-react";
import api from "@/services/api";
import toast from "react-hot-toast";
import { setUser } from "@/store/userSlice";

import { Button } from "@/components/ui/button";
import {
  Card,
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  
  // Unified State for cleaner code
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || "",
    gender: user?.gender || "",
    about: user?.about || "",
    photoUrl: user?.photoUrl || "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleGenderChange = (value) => {
    setFormData({ ...formData, gender: value });
    setError("");
  };

  const editHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await api.patch("/profile/edit", formData);
      dispatch(setUser(res.data.data || res.data));
      toast.success("Profile updated successfully! ✨");
    } catch (error) {
      const errData = error?.response?.data;
      setError(
        errData?.message || errData?.errors?.[0]?.msg || "Failed to update profile."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* LEFT COLUMN: EDIT FORM */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle>Edit Details</CardTitle>
          <CardDescription>Make changes to your profile here. Click save when you're done.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="profile-form" onSubmit={editHandler} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Tony"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Stark"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="25"
                  min="18"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={handleGenderChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input
                id="photoUrl"
                name="photoUrl"
                type="url"
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About Me</Label>
              <Textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="I love building scalable apps using React and Node.js..."
                className="resize-none h-24"
              />
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          </form>
        </CardContent>
        <CardFooter className="border-t bg-muted/20 px-6 py-4">
          <Button
            type="submit"
            form="profile-form"
            className="w-full sm:w-auto ml-auto"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      {/* RIGHT COLUMN: LIVE PREVIEW */}
      <div className="flex flex-col items-center justify-start lg:sticky lg:top-24">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Live Preview
        </h3>
        
        {/* Static Preview Card (Mirrors UserCard visuals, no physics) */}
        <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-card border shadow-xl aspect-[3/4] transition-all duration-300">
          <div className="absolute inset-0 z-0">
            {formData.photoUrl ? (
              <img 
                src={formData.photoUrl} 
                alt="Profile Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <UserIcon className="w-20 h-20 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
          </div>

          <div className="absolute bottom-0 z-10 w-full p-6 text-white">
            <h2 className="text-3xl font-bold mb-1 drop-shadow-md">
              {formData.firstName || "First"}{" "}
              {formData.lastName || "Last"}{" "}
              {formData.age && <span className="text-xl font-normal text-white/80">{formData.age}</span>}
            </h2>
            
            <div className="space-y-3 mb-4">
              <p className="text-sm text-white/90 line-clamp-3 min-h-[1.25rem]">
                {formData.about || "Your bio will appear here..."}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Briefcase className="w-4 h-4" />
                <span>{user?.jobTitle || "Software Engineer"}</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-white/20">
              {/* Dummy buttons to complete the visual preview */}
              <div className="h-12 w-12 rounded-full border-2 border-white/20 bg-black/20" />
              <div className="h-12 w-12 rounded-full border-2 border-white/20 bg-black/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;