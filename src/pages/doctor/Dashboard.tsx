import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import type { Appointment } from "../../types";
import { Button } from "../../components/Button";

interface DoctorAppointmentsResponse {
  data: Appointment[];
  totalPages: number;
}

export default function DoctorDashboard() {
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<DoctorAppointmentsResponse, Error>({
    queryKey: ["doctor-appointments", page, status, date],
    queryFn: async (): Promise<DoctorAppointmentsResponse> => {
      const res = await api.get<DoctorAppointmentsResponse>(
        `/appointments/doctor`,
        { params: { page, status, date } }
      );
      return res.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "COMPLETED" | "CANCELLED";
    }) => {
      await api.patch("/appointments/update-status", {
        appointment_id: id,
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <select
          className="border px-3 py-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button onClick={() => setPage(1)}>Filter</Button>
      </div>

      {isLoading && <p>Loading...</p>}

      <div className="space-y-4">
        {data?.data?.map((appt) => (
          <div
            key={appt.id}
            className="border rounded p-4 shadow flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{appt.patient.name}</p>
              <p className="text-gray-600">Date: {appt.date}</p>
              <p className="text-sm">Status: {appt.status}</p>
            </div>
            {appt.status === "PENDING" && (
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    updateStatus.mutate({ id: appt.id, status: "COMPLETED" })
                  }
                >
                  Mark Completed
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() =>
                    updateStatus.mutate({ id: appt.id, status: "CANCELLED" })
                  }
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data?.totalPages && data.totalPages > 1 && (
        <div className="flex gap-2 mt-4 justify-center">
          <Button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-3 py-2 border rounded">{page}</span>
          <Button
            onClick={() =>
              setPage((p) =>
                data?.totalPages ? Math.min(p + 1, data.totalPages) : p + 1
              )
            }
            disabled={page === data?.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
