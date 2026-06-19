import { useState, useEffect, useCallback } from "react";
import { DoctorProfile } from "../types";
import { getDoctors, addDoctor, updateDoctor, deleteDoctor } from "../firebase/firestore";
// @ts-ignore
import doctorImg from "../assets/images/regenerated_image_1781715483180.png";

export function useDoctors() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDoctors(doctorImg);
      setDoctors(data);
    } catch (err: any) {
      console.error("Error fetching doctors:", err);
      setError(err.message || "Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const add = async (item: Omit<DoctorProfile, 'id'>) => {
    try {
      const id = await addDoctor(item);
      setDoctors(prev => [...prev, { id, ...item }]);
      return id;
    } catch (err: any) {
      console.error("Error adding doctor:", err);
      throw err;
    }
  };

  const edit = async (id: string, item: Partial<DoctorProfile>) => {
    try {
      await updateDoctor(id, item);
      setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...item } : d));
    } catch (err: any) {
      console.error("Error editing doctor:", err);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteDoctor(id);
      setDoctors(prev => prev.filter(d => d.id !== id));
    } catch (err: any) {
      console.error("Error deleting doctor:", err);
      throw err;
    }
  };

  return {
    doctors,
    loading,
    error,
    refresh: fetchDoctors,
    add,
    edit,
    remove
  };
}
