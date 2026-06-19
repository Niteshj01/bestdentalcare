import { useState, useEffect, useCallback } from "react";
import { AppointmentItem } from "../types";
import { getAppointments, addAppointment, updateAppointmentStatus, deleteAppointment } from "../firebase/firestore";

export function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setError(err.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const book = async (item: Omit<AppointmentItem, 'id' | 'status' | 'createdAt'>) => {
    try {
      const id = await addAppointment(item);
      const newAppt: AppointmentItem = {
        ...item,
        id,
        status: "New",
        createdAt: new Date().toISOString()
      };
      setAppointments(prev => [newAppt, ...prev]);
      return id;
    } catch (err: any) {
      console.error("Error booking appointment:", err);
      throw err;
    }
  };

  const updateStatus = async (id: string, status: AppointmentItem["status"]) => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err: any) {
      console.error("Error updating appointment status:", err);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteAppointment(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      console.error("Error deleting appointment:", err);
      throw err;
    }
  };

  return {
    appointments,
    loading,
    error,
    refresh: fetchAppointments,
    book,
    updateStatus,
    remove
  };
}
