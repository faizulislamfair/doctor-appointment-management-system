import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password, role });
      localStorage.setItem("token", res.data.token);
      if (role === "PATIENT") navigate("/patient/dashboard");
      else navigate("/doctor/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-3xl mb-4">Login</h1>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 mb-2 w-64"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 mb-2 w-64"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as "PATIENT" | "DOCTOR")}
        className="border p-2 mb-2 w-64"
      >
        <option value="PATIENT">Login as Patient</option>
        <option value="DOCTOR">Login as Doctor</option>
      </select>
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded w-64">
        Login
      </button>
    </div>
  );
}
