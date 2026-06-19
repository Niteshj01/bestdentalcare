import { useState, useEffect, useCallback } from "react";
import { ServiceItem } from "../types";
import { getServices, addService, updateService, deleteService } from "../firebase/firestore";

export function useServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getServices();
      setServices(data);
    } catch (err: any) {
      console.error("Error fetching services:", err);
      setError(err.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const add = async (item: Omit<ServiceItem, 'id'>) => {
    try {
      const id = await addService(item);
      setServices(prev => [...prev, { id, ...item }]);
      return id;
    } catch (err: any) {
      console.error("Error adding service:", err);
      throw err;
    }
  };

  const edit = async (id: string, item: Partial<ServiceItem>) => {
    try {
      await updateService(id, item);
      setServices(prev => prev.map(s => s.id === id ? { ...s, ...item } : s));
    } catch (err: any) {
      console.error("Error editing service:", err);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      console.error("Error deleting service:", err);
      throw err;
    }
  };

  return {
    services,
    loading,
    error,
    refresh: fetchServices,
    add,
    edit,
    remove
  };
}
