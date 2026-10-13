import { useCallback, useEffect, useState } from "react";
import {
  getDevices,
  addDevice as apiAddDevice,
  updateDevice as apiUpdateDevice,
  deleteDevice as apiDeleteDevice,
} from "../services/api";

// Centralizes the Device Management registry + CRUD operations, so
// Devices.jsx (and any future consumer) share one source of truth and one
// set of network calls, and every write automatically reloads the list --
// no component needs to remember to do that itself.
export function useDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const rows = await getDevices();
    setDevices(rows);
    setLoading(false);
  }, []);

  // Initial load on mount. Deliberately not calling reload() itself here --
  // an inline async task keeps the state updates inside a resolved promise
  // callback rather than a traceable function invoked synchronously from
  // the effect body.
  useEffect(() => {
    let cancelled = false;

    getDevices().then((rows) => {
      if (cancelled) return;
      setDevices(rows);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const isDeviceIdTaken = useCallback(
    (id) => devices.some((d) => String(d.id) === String(id)),
    [devices]
  );

  async function addDevice(device) {
    const result = await apiAddDevice(device);
    if (result?.success) await reload();
    return result;
  }

  async function updateDevice(device) {
    const result = await apiUpdateDevice(device);
    if (result?.success) await reload();
    return result;
  }

  async function removeDevice(id) {
    const result = await apiDeleteDevice(id);
    if (result?.success) await reload();
    return result;
  }

  return {
    devices,
    loading,
    reload,
    isDeviceIdTaken,
    addDevice,
    updateDevice,
    removeDevice,
  };
}
