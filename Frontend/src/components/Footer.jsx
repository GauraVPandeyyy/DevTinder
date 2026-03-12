export default function Footer() {
  return (
    <footer className="border-t mt-10 fixed bottom-0 w-full">
      {" "}
      <div className="max-w-6xl mx-auto py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} DevTinder. Built with ❤️ by Gaurav
        Pandey.{" "}
      </div>{" "}
    </footer>
  );
}
