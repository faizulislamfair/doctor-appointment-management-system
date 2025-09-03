export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  photo_url?: string;
}

export interface Appointment {
  id: string;
  doctor: Doctor;
  patient: { id: string; name: string };
  date: string;
  status: "PENDING" | "CANCELLED" | "COMPLETED";
}
