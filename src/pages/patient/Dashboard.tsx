import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import type { Doctor } from "../../types";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";

interface DoctorsResponse {
  data: Doctor[];
  totalPages: number;
}

export default function PatientDashboard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState("");

  const { data, isLoading, refetch } = useQuery<DoctorsResponse, Error>({
    queryKey: ["doctors", page, search, specialization],
    queryFn: async () => {
      const res = await api.get<DoctorsResponse>("/doctors", {
        params: { page, limit: 10, search, specialization },
      });
      return res.data;
    },
  });

  const bookAppointment = async () => {
    if (!selectedDoctor || !date) return alert("Select date");
    try {
      await api.post("/appointments", { doctorId: selectedDoctor.id, date });
      alert("Appointment booked!");
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          placeholder="Search doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Specializations</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Neurology">Neurology</option>
        </select>
        <Button onClick={() => setPage(1)}>Filter</Button>
      </div>

      {isLoading ? (
        <p>Loading doctors...</p>
      ) : (
        <div className="grid gap-4">
          {data?.data.map((doc) => (
            <div key={doc.id} className="border rounded p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">{doc.name}</p>
                <p className="text-gray-600">{doc.specialization}</p>
              </div>
              <Button
                onClick={() => {
                  setSelectedDoctor(doc);
                  setIsModalOpen(true);
                }}
              >
                Book
              </Button>
            </div>
          ))}
        </div>
      )}

      {data?.totalPages && data.totalPages > 1 && (
        <div className="flex gap-2 mt-4 justify-center">
          <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="px-3 py-2 border rounded">{page}</span>
          <Button
            onClick={() => setPage((p) => (data?.totalPages ? Math.min(p + 1, data.totalPages) : p + 1))}
            disabled={page === data?.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
        <p className="mb-2">Doctor: {selectedDoctor?.name}</p>
        <input type="date" className="border p-2 rounded w-full mb-4" value={date} onChange={(e) => setDate(e.target.value)} />
        <Button onClick={bookAppointment}>Confirm</Button>
      </Modal>
    </div>
  );
}
