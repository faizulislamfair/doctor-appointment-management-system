import { Link } from "react-router";
import { Button } from "../../src/components/Button";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Doctor Appointment Management System
      </h1>
      {/* Buttons */}
      <div className="flex gap-4">
        <Link to="/login">
          <Button className="px-6 py-3 text-lg rounded-lg">Login</Button>
        </Link>
        <Link to="/register">
          <Button className="px-6 py-3 text-lg rounded-lg">
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
}
