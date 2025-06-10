import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import PatientAppointmentForm from "../components/PatientAppointmentForm";
import { getUser } from "../utils/auth";

export default function AppointmentBooking() {
  const user = getUser();

  if (!user || user.role !== "Patient") {
    return (
      <div className="text-center py-20 text-red-600">
        Bạn cần đăng nhập bằng tài khoản bệnh nhân để đặt lịch hẹn.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Navbar />
      <main className="flex-grow">
        <PatientAppointmentForm patientId={user.userId} />
      </main>
      <Footer />
    </div>
  );
}
