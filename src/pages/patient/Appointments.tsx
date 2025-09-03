"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import type { Appointment } from "../../types";
import { Button } from "../../components/Button";

interface AppointmentsResponse {
  data: Appointment[];
  totalPages: number;
}

export default function PatientAppointments() {
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const queryClient = useQueryClient();

  // Fetch patient appointments
  const query = useQuery({
    queryKey: ["patient-appointments", page, status],
    queryFn: async (): Promise<AppointmentsResponse> => {
      const res = await api.get("/appointments/patient", {
        params: { page, status },
      });
      return res.data as AppointmentsResponse;
    },
  });

  const { data, isLoading } = query;

  // Cancel appointment mutation
  const cancelMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      await api.patch("/appointments/update-status", {
        status: "CANCELLED",
        appointment_id: appointmentId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
    },
  });

  const { mutate: cancelAppointment, status: cancelStatus } = cancelMutation;
  const canceling = cancelStatus === "pending";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <select
          className="border px-3 py-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <Button onClick={() => setPage(1)}>Filter</Button>
      </div>

      {/* Loading */}
      {isLoading && <p>Loading appointments...</p>}

      {/* Appointment List */}
      <div className="space-y-4">
        {data?.data?.map((appt: Appointment) => (
          <div
            key={appt.id}
            className="border rounded p-4 shadow flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{appt.doctor.name}</p>
              <p>{appt.doctor.specialization}</p>
              <p className="text-gray-600">Date: {appt.date}</p>
              <p className="text-sm">Status: {appt.status}</p>
            </div>
            {appt.status === "PENDING" && (
              <Button onClick={() => cancelAppointment(appt.id)} disabled={canceling}>
                Cancel
              </Button>
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
                data.totalPages ? Math.min(p + 1, data.totalPages) : p + 1
              )
            }
            disabled={page === data.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
