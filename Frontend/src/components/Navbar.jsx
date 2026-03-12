import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav>
      <div className="flex justify-between p-4 fixed top-0 w-full">
        {/* Logo */}
        <h1 className="text-xl font-bold text-pink-600">DevTinder</h1>

        {/* Navigation */}
        <div className="flex gap-4 items-center">
          <Button variant="ghost">Feed</Button>
          <Button variant="ghost">Matches</Button>
          <Button>Profile</Button>
        </div>
      </div>
    </nav>
  );
}
