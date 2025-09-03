import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import api from "../api/axios";

export default function Register() {
  const [tab, setTab] = useState<"PATIENT" | "DOCTOR">("PATIENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo_url, setPhotoUrl] = useState("");
  const [specialization, setSpecialization] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (tab === "PATIENT") {
        await api.post("/auth/register/patient", {
          name,
          email,
          password,
          photo_url: photo_url || undefined,
        });
        alert("Patient registered successfully!");
      } else {
        if (!specialization) return alert("Select specialization");
        await api.post("/auth/register/doctor", {
          name,
          email,
          password,
          photo_url: photo_url || undefined,
          specialization,
        });
        alert("Doctor registered successfully!");
      }

      navigate("/login");
    } catch (error: unknown) {
      // Type-safe error handling
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Registration failed");
      } else {
        alert("Registration failed due to an unexpected error");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-3xl mb-4">Register</h1>

      {/* Tabs */}
      <div className="flex mb-4 border-b">
        <button
          className={`px-4 py-2 ${
            tab === "PATIENT" ? "border-b-2 border-blue-500 font-bold" : ""
          }`}
          onClick={() => setTab("PATIENT")}
        >
          Patient
        </button>
        <button
          className={`px-4 py-2 ${
            tab === "DOCTOR" ? "border-b-2 border-blue-500 font-bold" : ""
          }`}
          onClick={() => setTab("DOCTOR")}
        >
          Doctor
        </button>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-2 w-80">
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Photo URL (optional)"
          className="border p-2 rounded"
          value={photo_url}
          onChange={(e) => setPhotoUrl(e.target.value)}
        />

        {tab === "DOCTOR" && (
          <select
            className="border p-2 rounded"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="">Select Specialization</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Neurology">Neurology</option>
            <option value="Oncology">Oncology</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>
        )}

        <button
          onClick={handleRegister}
          className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer select-none p-2 rounded mt-2"
        >
          Register
        </button>
      </div>
    </div>
  );
}
