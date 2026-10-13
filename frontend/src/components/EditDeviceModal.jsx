import { useState } from "react";
import { parseLocation, composeLocation } from "../utils/location";
import { DEVICE_STATUS_OPTIONS } from "../constants";

// Edit form for an existing device. Device ID is read-only here by design
// -- only Name, Building, Floor, Bathroom, and Status can change. Reuses
// the same card/input/button styling as the rest of Devices.jsx so this
// doesn't introduce a new visual language, just a focused overlay.
export default function EditDeviceModal({ device, onClose, onSave }) {
    const parsed = parseLocation(device.location);

    const [form, setForm] = useState({
        NAME: device.NAME ?? "",
        building: parsed.building === "미지정" ? "" : parsed.building,
        floor: parsed.floor ?? "",
        bathroom: parsed.room ?? "",
        STATUS: device.STATUS || DEVICE_STATUS_OPTIONS[0],
    });
    const [saving, setSaving] = useState(false);

    function update(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSave() {
        if (!form.NAME.trim() || !form.building.trim() || !form.STATUS) {
            alert("이름, 건물, 상태는 필수 항목입니다.");
            return;
        }

        setSaving(true);

        const result = await onSave({
            id: device.id,
            NAME: form.NAME.trim(),
            location: composeLocation(form),
            STATUS: form.STATUS,
        });

        setSaving(false);

        if (result?.success) {
            onClose();
        } else {
            alert(result?.error || "장치 수정에 실패했습니다.");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg border p-5 shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-black">장치 수정</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-800 text-xs font-bold px-1.5 py-0.5 rounded border border-slate-300 bg-white shadow-xs"
                    >
                        닫기
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">

                    <div className="col-span-2">
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">Device ID</label>
                        <input
                            className="border rounded p-2 w-full bg-slate-100 text-slate-500"
                            value={device.id}
                            readOnly
                            disabled
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">Device Name</label>
                        <input
                            className="border rounded p-2 w-full"
                            value={form.NAME}
                            onChange={(e) => update("NAME", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">Building</label>
                        <input
                            className="border rounded p-2 w-full"
                            value={form.building}
                            onChange={(e) => update("building", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">Floor</label>
                        <input
                            className="border rounded p-2 w-full"
                            value={form.floor}
                            onChange={(e) => update("floor", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">Bathroom</label>
                        <input
                            className="border rounded p-2 w-full"
                            value={form.bathroom}
                            onChange={(e) => update("bathroom", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] text-slate-500 font-bold block mb-1">Status</label>
                        <select
                            className="border rounded p-2 w-full"
                            value={form.STATUS}
                            onChange={(e) => update("STATUS", e.target.value)}
                        >
                            {DEVICE_STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                </div>

                <div className="flex justify-end gap-2 mt-5">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-slate-200 text-slate-700 text-sm font-bold"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 rounded bg-emerald-600 text-white text-sm font-bold disabled:opacity-50"
                    >
                        {saving ? "저장 중..." : "저장"}
                    </button>
                </div>

            </div>
        </div>
    );
}
