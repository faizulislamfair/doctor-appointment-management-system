import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios";

type Role = "PATIENT" | "DOCTOR";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("PATIENT");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post<{ token: string }>("/auth/login", {
        email,
        password,
        role,
      });

      // Save token
      localStorage.setItem("token", res.data.token);

      // Redirect
      if (role === "PATIENT") navigate("/patient/dashboard");
      else navigate("/doctor/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-3xl mb-4">Login</h1>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 mb-2 w-64 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 mb-2 w-64 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="border p-2 mb-2 w-64 rounded"
      >
        <option value="PATIENT">Login as Patient</option>
        <option value="DOCTOR">Login as Doctor</option>
      </select>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 rounded w-64 hover:bg-blue-600 cursor-pointer select-none transition"
      >
        Login
      </button>
    </div>
  );
}
