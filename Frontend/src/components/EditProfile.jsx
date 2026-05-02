import { useState } from "react";
import { useDispatch } from "react-redux";
import { Loader2, Briefcase, Sparkles, Lock, Eye, EyeOff } from "lucide-react";
import api from "@/services/api";
import toast from "react-hot-toast";
import { setUser } from "@/store/userSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allSkills = [
   "React",
  "Next.js",
  "Tailwind CSS",
  "HTML",
  "CSS",

  // Backend
  "Node.js",
  "Express.js",

  // Databases
  "MongoDB",
  "Mongoose",
  "SQL",
  "PostgreSQL",
  "Redis",

  // Languages
  "JavaScript",
  "TypeScript",
  "Python",
  "C++",
  "Java",

  // DevOps & Tools
  "Git",
  "GitHub",
  "Docker",
  "CI/CD",
  "Nginx",
  "Linux",
];

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  // --- PROFILE UPDATE STATE ---
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || "",
    gender: user?.gender || "",
    about: user?.about || "",
    jobTitle: user?.jobTitle || "",
    skills: user?.skills || [],
    profileImage: null,
  });

  const [previewImage, setPreviewImage] = useState(user?.photoUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // --- PASSWORD UPDATE STATE ---
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- PROFILE UPDATE HANDLER ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});

    try {
      if (formData.skills.length < 2) {
        toast.error("Add at least 2 skills");
        setIsLoading(false);
        return;
      }
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "skills") {
          formData.skills.forEach((skill) => {
            form.append("skills[]", skill);
          });
        } else if (formData[key] !== null) {
          form.append(key, formData[key]);
        }
      });

      const res = await api.patch("/profile/edit", form);
      dispatch(setUser(res.data.data || res.data.user || res.data));
      toast.success("Profile updated successfully! ✨");
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.errors && Array.isArray(errData.errors)) {
        const newErrors = {};
        errData.errors.forEach((err) => {
          if (err.path.startsWith("skills")) {
            newErrors.skills = err.msg;
          } else {
            newErrors[err.path] = err.msg;
          }
        });
        setFieldErrors(newErrors);
        toast.error("Please fix the errors highlighted below.");
      } else {
        toast.error(errData?.message || "Failed to update profile");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  const handleGenderChange = (value) => {
    setFormData({ ...formData, gender: value });
    if (fieldErrors.gender) setFieldErrors({ ...fieldErrors, gender: null });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // --- PASSWORD UPDATE HANDLER ---
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Passwords do not match! ❌");
    }

    if (passwordData.newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }

    setIsPasswordLoading(true);
    try {
      // API call to the backend route you provided[cite: 13]
      await api.patch("/updatePassword", {
        password: passwordData.newPassword,
      });
      toast.success("Password Updated successfully! 🔐");

      // Clear the inputs after success
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.errors && Array.isArray(errData.errors)) {
        toast.error(errData.errors[0].msg);
      } else {
        toast.error(errData?.message || "Failed to update password");
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
   <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">

  {/* --- LEFT: LIVE PREVIEW CARD --- */}
  {/* Card wrapper par directly sticky apply karo */}
  <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col items-center">
    
    <h3 className="text-sm font-semibold text-[#22d3ee] uppercase tracking-widest mb-4 flex items-center gap-2">
      <Sparkles className="w-4 h-4" /> Live Preview
    </h3>

        <div className="relative w-full max-w-[320px] aspect-[3/4] overflow-hidden rounded-[2rem] bg-black shadow-[0_10px_40px_rgba(34,211,238,0.1)] border-[0.5px] border-white/10">
          <img
            src={previewImage || "https://github.com/shadcn.png"}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
            onError={(e) => {
              e.target.src = "https://github.com/shadcn.png";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent opacity-90" />

          <div className="absolute bottom-0 z-10 w-full p-5 pb-6 flex flex-col justify-end text-white">
            <div className="flex items-end gap-2 mb-1">
              <h2 className="text-2xl font-bold tracking-tight drop-shadow-md truncate">
                {formData.firstName || "First"} {formData.lastName || " "}
              </h2>
              <span className="text-xl font-medium text-white/70 pb-[2px]">
                {formData.age || " "}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#22d3ee] mb-3 font-medium">
              <Briefcase className="w-3.5 h-3.5" />
              <span className="truncate">
                {formData.jobTitle || "Software Engineer"}
              </span>
            </div>
            <p className="text-xs text-white/80 line-clamp-2 leading-relaxed font-light">
              {formData.about || "Your amazing bio will appear here..."}
            </p>
          </div>
        </div>
      </div>

      {/* --- RIGHT: SETTINGS SECTIONS --- */}
      <div className="lg:col-span-7 flex flex-col gap-8">
        {/* PROFILE FORM */}
        <form
          onSubmit={handleSave}
          className="space-y-6 bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-2xl backdrop-blur-sm"
        >
          {/* Media Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">
              Media
            </h3>
            <div className="space-y-2">
              <Label className="text-white/70">Upload Profile Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-black/40 border-white/10 text-white file:text-[#22d3ee] file:bg-transparent file:border-0 file:mr-4 file:font-medium hover:file:cursor-pointer cursor-pointer rounded-xl h-12 pt-2.5"
              />
              {fieldErrors.photoUrl && (
                <p className="text-xs text-red-500 font-medium">
                  {fieldErrors.photoUrl}
                </p>
              )}
            </div>
          </div>

          {/* Personal Info Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">
              Personal Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70">First Name</Label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`bg-black/40 text-white rounded-xl h-12 transition-all ${
                    fieldErrors.firstName
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-white/10 focus-visible:ring-[#22d3ee]"
                  }`}
                />
                {fieldErrors.firstName && (
                  <p className="text-xs text-red-500 font-medium">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Last Name</Label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`bg-black/40 text-white rounded-xl h-12 transition-all ${
                    fieldErrors.lastName
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-white/10 focus-visible:ring-[#22d3ee]"
                  }`}
                />
                {fieldErrors.lastName && (
                  <p className="text-xs text-red-500 font-medium">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Age</Label>
                <Input
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  className={`bg-black/40 text-white rounded-xl h-12 transition-all ${
                    fieldErrors.age
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-white/10 focus-visible:ring-[#22d3ee]"
                  }`}
                />
                {fieldErrors.age && (
                  <p className="text-xs text-red-500 font-medium">
                    {fieldErrors.age}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-white/70">Gender</Label>
                <Select
                  onValueChange={handleGenderChange}
                  value={formData.gender}
                >
                  <SelectTrigger
                    className={`bg-black/40 text-white rounded-xl h-12 transition-all pl-2 py-5.5 ${
                      fieldErrors.gender
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-white/10 focus:ring-1 focus:ring-[#22d3ee]"
                    }`}
                  >
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#09090b] border-white/10 text-white pl-2 space-y-2 py-2">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="others">Other</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.gender && (
                  <p className="text-xs text-red-500 font-medium">
                    {fieldErrors.gender}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">
              Professional
            </h3>

            <div className="space-y-2">
              <Label className="text-white/70">Job Title</Label>
              <Input
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g., Full Stack Developer"
                className={`bg-black/40 text-white rounded-xl h-12 transition-all ${
                  fieldErrors.jobTitle
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-white/10 focus-visible:ring-[#22d3ee]"
                }`}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">About You</Label>
              <Textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Write a short bio about your tech stack and interests..."
                className={`bg-black/40 text-white rounded-xl min-h-[120px] resize-none transition-all ${
                  fieldErrors.about
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-white/10 focus-visible:ring-[#22d3ee]"
                }`}
              />
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">
                Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#22d3ee]/20 text-[#fdfdfd] rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          skills: formData.skills.filter((s) => s !== skill),
                        })
                      }
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              {/* --- Modern Skills Dropdown --- */}
              <Select
                onValueChange={(value) => {
                  if (value && !formData.skills.includes(value)) {
                    setFormData({
                      ...formData,
                      skills: [...formData.skills, value],
                    });
                  }
                }}
              >
                <SelectTrigger className="w-full bg-black/40 text-white rounded-xl h-12 border-white/10 focus:ring-1 focus:ring-[#22d3ee] pl-3 py-5.5">
                  <SelectValue placeholder="Select Skill to Add" />
                </SelectTrigger>
                <SelectContent className="bg-[#09090b] border-white/10 text-white max-h-60 custom-scrollbar p-3">
                  {allSkills.map((skill) => (
                    <SelectItem 
                      key={skill} 
                      value={skill}
                      disabled={formData.skills.includes(skill)}
                      className="hover:bg-white/10 focus:bg-[#22d3ee]/20 focus:text-[#22d3ee] cursor-pointer"
                    >
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <input
                type="text"
                placeholder="Add custom skill (Press Enter)"
                className="w-full bg-black/40 text-white p-3 rounded-xl border border-white/10"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const value = e.target.value.trim();
                    if (value && !formData.skills.includes(value)) {
                      setFormData({
                        ...formData,
                        skills: [...formData.skills, value],
                      });
                      e.target.value = "";
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="mt-8 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-[#22d3ee] to-[#0284c7] text-white shadow-[0_10px_30px_rgba(34,211,238,0.2)] hover:shadow-[0_10px_40px_rgba(34,211,238,0.4)] transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </form>

        {/* --- SECURITY / PASSWORD FORM (NEW) --- */}
        <form
          onSubmit={handlePasswordUpdate}
          className="space-y-6 bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-2xl backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#22d3ee]" /> Security Settings
          </h3>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-white/70">New Password</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="pr-11 bg-black/40 text-white rounded-xl h-12 border-white/10 focus-visible:ring-[#22d3ee]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-white transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/70">Confirm New Password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="pr-11 bg-black/40 text-white rounded-xl h-12 border-white/10 focus-visible:ring-[#22d3ee]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="outline"
            disabled={
              isPasswordLoading ||
              !passwordData.newPassword ||
              !passwordData.confirmPassword
            }
            className="w-full h-14 mt-4 text-lg font-bold rounded-2xl border-[#22d3ee]/30 text-[#22d3ee] hover:bg-[#22d3ee] hover:text-black transition-all"
          >
            {isPasswordLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
