import { useState } from "react";
import type { ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  photo_url?: string;
}

interface DoctorsResponse {
  data: Doctor[];
  totalPages: number;
}

export default function PatientDashboard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState("");

  // Fetch doctors
  const { data, isLoading, refetch } = useQuery<DoctorsResponse, unknown>({
    queryKey: ["doctors", page, search, specialization],
    queryFn: async () => {
      const res = await api.get<DoctorsResponse>("/doctors", {
        params: { page, limit: 10, search, specialization },
      });
      return res.data;
    },
  });

  const bookAppointment = async () => {
    if (!selectedDoctor || !date) return alert("Select a date");

    try {
      await api.post("/appointments", {
        doctorId: selectedDoctor.id,
        date,
      });
      alert("Appointment booked!");
      setIsModalOpen(false);
      refetch();
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("Unexpected error occurred");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search doctor..."
          className="border px-3 py-2 rounded"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded"
          value={specialization}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setSpecialization(e.target.value)
          }
        >
          <option value="">All Specializations</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Endocrinology">Endocrinology</option>
            <option value="Gastroenterology">Gastroenterology</option>
            <option value="Neurology">Neurology</option>
            <option value="Oncology">Oncology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Psychiatry">Psychiatry</option>
            <option value="Radiology">Radiology</option>
        </select>
        <Button onClick={() => setPage(1)}>Filter</Button>
      </div>

      {isLoading && <p>Loading doctors...</p>}

      {/* Doctor list */}
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3 pt-5">
        {data?.data?.map((doc) => (
          <div
            key={doc.id}
            className="border rounded p-4 shadow flex flex-col items-center"
          >
            <img
              src={doc.photo_url || "/default-doctor.png"}
              alt={doc.name}
              className="w-24 h-24 rounded-full mb-2 object-cover"
            />
            <p className="font-bold">{doc.name}</p>
            <p className="text-gray-600">{doc.specialization}</p>
            <Button
              className="mt-2 w-full"
              onClick={() => {
                setSelectedDoctor(doc);
                setIsModalOpen(true);
              }}
            >
              Book Appointment
            </Button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex gap-2 mt-4 justify-center">
          <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="px-3 py-2 border rounded">{page}</span>
          <Button
            onClick={() =>
              setPage((p) => (data?.totalPages ? Math.min(p + 1, data.totalPages) : p + 1))
            }
            disabled={page === data?.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Booking Modal */}
      <Modal
        title="Book Appointment"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <p className="mb-2">Doctor: {selectedDoctor?.name}</p>
        <input
          type="date"
          className="border px-3 py-2 rounded w-full mb-4"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button onClick={bookAppointment} className="w-full">
          Confirm
        </Button>
      </Modal>
    </div>
  );
}
