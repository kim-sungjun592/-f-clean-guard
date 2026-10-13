import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDevices } from "../hooks/useDevices";
import EditDeviceModal from "../components/EditDeviceModal";
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

// Mobile-adapted Device Management screen. All CRUD logic comes from
// useDevices()/EditDeviceModal -- exactly what Devices.jsx (desktop) uses
// -- so there is no duplicated validation/save/delete logic here, only a
// touch-friendly card layout instead of a table.
export default function MobileDeviceManagement() {
  const navigate = useNavigate();
  const { devices, loading, addDevice, updateDevice, removeDevice, isDeviceIdTaken } = useDevices();

  const [newDevice, setNewDevice] = useState(EMPTY_FORM);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

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
      setShowForm(false);
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
    <div className="min-h-screen bg-slate-100 flex flex-col font-mono">
      <div className="sticky top-0 z-40 bg-slate-900 text-white px-4 py-3 shadow-sm flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          className="p-2 -ml-2 rounded-lg bg-slate-800 border border-slate-700 text-lg leading-none active:scale-95 transition-transform shrink-0"
        >
          ←
        </button>
        <div className="font-black text-base text-emerald-400 flex-1">장치 관리</div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold active:scale-95 transition-transform shrink-0"
        >
          {showForm ? "닫기" : "+ 추가"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border-b border-slate-200 p-4 space-y-3">
          <input
            className="border rounded-xl p-3 w-full"
            placeholder="Device ID"
            value={newDevice.id}
            onChange={(e) => updateField("id", e.target.value)}
          />
          <input
            className="border rounded-xl p-3 w-full"
            placeholder="Device Name"
            value={newDevice.NAME}
            onChange={(e) => updateField("NAME", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="border rounded-xl p-3 w-full"
              placeholder="Building"
              value={newDevice.building}
              onChange={(e) => updateField("building", e.target.value)}
            />
            <input
              className="border rounded-xl p-3 w-full"
              placeholder="Floor"
              value={newDevice.floor}
              onChange={(e) => updateField("floor", e.target.value)}
            />
          </div>
          <input
            className="border rounded-xl p-3 w-full"
            placeholder="Bathroom"
            value={newDevice.bathroom}
            onChange={(e) => updateField("bathroom", e.target.value)}
          />
          <select
            className="border rounded-xl p-3 w-full"
            value={newDevice.STATUS}
            onChange={(e) => updateField("STATUS", e.target.value)}
          >
            {DEVICE_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddDevice}
            disabled={adding}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-50 active:scale-95 transition-transform"
          >
            {adding ? "추가 중..." : "장치 추가"}
          </button>
        </div>
      )}

      <main
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
      >
        {loading && devices.length === 0 && (
          <div className="text-center text-sm text-slate-400 font-bold py-10">불러오는 중...</div>
        )}

        {!loading && devices.length === 0 && (
          <div className="bg-white border border-slate-300 rounded-2xl shadow-sm p-8 text-center text-sm text-slate-400 font-bold">
            등록된 장치가 없습니다.
          </div>
        )}

        {devices.map((device) => (
          <div key={device.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="font-black text-sm truncate">{device.id}</div>
              <span className="text-xs font-bold text-slate-500 shrink-0 ml-2">{device.STATUS}</span>
            </div>
            <div className="text-sm font-bold mt-1 truncate">{device.NAME}</div>
            <div className="text-xs text-slate-500 mt-0.5 truncate">{device.location}</div>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => setEditingDevice(device)}
                className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold active:scale-95 transition-transform"
              >
                ✏️ 수정
              </button>
              <button
                type="button"
                onClick={() => handleDelete(device)}
                className="flex-1 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-bold active:scale-95 transition-transform"
              >
                🗑️ 삭제
              </button>
            </div>
          </div>
        ))}
      </main>

      {editingDevice && (
        <EditDeviceModal
          device={editingDevice}
          onClose={() => setEditingDevice(null)}
          onSave={updateDevice}
        />
      )}
    </div>
  );
}
