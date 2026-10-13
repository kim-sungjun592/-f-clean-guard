import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import EditDeviceModal from "../components/EditDeviceModal";
import { useDevices } from "../hooks/useDevices";
import { composeLocation } from "../utils/location";
import { DEVICE_STATUS_OPTIONS } from "../constants";

const EMPTY_FORM = {
  id: "",
  NAME: "",
  building: "",
  floor: "",
  bathroom: "",
  STATUS: DEVICE_STATUS_OPTIONS[0],
};

export default function DeviceManager() {

  const { devices, addDevice, updateDevice, removeDevice, isDeviceIdTaken } = useDevices();

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  const [newDevice, setNewDevice] = useState(EMPTY_FORM);
  const [adding, setAdding] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  function updateField(field, value) {
    setNewDevice((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAddDevice() {

    const id = newDevice.id.trim();
    const name = newDevice.NAME.trim();
    const building = newDevice.building.trim();

    if (!id || !name || !building || !newDevice.STATUS) {
      alert("Device ID, Name, Building, Status는 필수 항목입니다.");
      return;
    }

    if (isDeviceIdTaken(id)) {
      alert(`Device ID '${id}'는 이미 사용 중입니다.`);
      return;
    }

    setAdding(true);

    const result = await addDevice({
      id,
      NAME: name,
      location: composeLocation(newDevice),
      STATUS: newDevice.STATUS,
    });

    setAdding(false);

    if (result?.success) {
      setNewDevice(EMPTY_FORM);
    } else {
      alert(result?.error || "장치 추가에 실패했습니다.");
    }
  }

  async function handleDelete(device) {
    const confirmed = window.confirm(
      `Delete device ${device.id}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    const result = await removeDevice(device.id);

    if (!result?.success) {
      alert(result?.error || "장치 삭제에 실패했습니다.");
    }
  }

  return (

    <>
      <Header currentTime={currentTime} />

      <div className="min-h-screen bg-slate-100 p-4 sm:p-6">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">

            <h1 className="text-2xl sm:text-3xl font-black">
              장치 관리
            </h1>

            <Link
              to="/"
              className="bg-slate-900 text-white px-4 py-2 rounded-lg"
            >
              Dashboard
            </Link>

          </div>

          {/* FORMULARIO */}

          <div className="bg-white rounded-lg border p-5 mb-6 shadow">

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

              <input
                className="border rounded p-2"
                placeholder="Device ID"
                value={newDevice.id}
                onChange={(e) => updateField("id", e.target.value)}
              />

              <input
                className="border rounded p-2"
                placeholder="Device Name"
                value={newDevice.NAME}
                onChange={(e) => updateField("NAME", e.target.value)}
              />

              <input
                className="border rounded p-2"
                placeholder="Building"
                value={newDevice.building}
                onChange={(e) => updateField("building", e.target.value)}
              />

              <input
                className="border rounded p-2"
                placeholder="Floor"
                value={newDevice.floor}
                onChange={(e) => updateField("floor", e.target.value)}
              />

              <input
                className="border rounded p-2"
                placeholder="Bathroom"
                value={newDevice.bathroom}
                onChange={(e) => updateField("bathroom", e.target.value)}
              />

              <select
                className="border rounded p-2"
                value={newDevice.STATUS}
                onChange={(e) => updateField("STATUS", e.target.value)}
              >
                {DEVICE_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

            </div>

            <button
              onClick={handleAddDevice}
              disabled={adding}
              className="mt-4 w-full sm:w-auto bg-emerald-600 text-white rounded px-4 py-2.5 disabled:opacity-50"
            >
              {adding ? "추가 중..." : "장치 추가"}
            </button>

          </div>

          {/* TABLA -- horizontally scrollable on narrow screens instead of
              squishing columns illegibly; identical appearance at desktop
              widths where it already fits. */}

          <div className="bg-white rounded-lg shadow border overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[640px] text-sm">

                <thead className="bg-slate-200">

                  <tr>

                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>

                  </tr>

                </thead>

                <tbody>

                  {

                    devices.map(device => (

                      <tr
                        key={device.id}
                        className="border-t hover:bg-slate-60"
                      >

                        <td className="p-3">{device.id}</td>
                        <td className="p-3">{device.NAME}</td>
                        <td className="p-3">{device.location}</td>
                        <td className="p-3">{device.STATUS}</td>

                        <td className="p-3">

                          <button
                            className="mr-1 p-2"
                            onClick={() => setEditingDevice(device)}
                          >
                            ✏️
                          </button>

                          <button className="p-2" onClick={() => handleDelete(device)}>
                            🗑️
                          </button>

                        </td>

                      </tr>

                    ))

                  }

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

      {editingDevice && (
        <EditDeviceModal
          device={editingDevice}
          onClose={() => setEditingDevice(null)}
          onSave={updateDevice}
        />
      )}

    </>

  );

}
