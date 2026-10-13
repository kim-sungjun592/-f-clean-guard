import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { getHistory } from "../services/api";

function NoHistoryMessage() {
    return (
        <div className="text-[11px] text-slate-400 text-center py-6 border border-dashed border-slate-300 rounded bg-slate-50 font-bold">
            No historical data available.
        </div>
    );
}

// Historical trend chart for a single device, sourced from getHistory.php
// -- which reads directly from `sensor_data` (there is no separate history
// table) and returns readings already grouped into 5-minute buckets.
// Renders a plain-text fallback when there is no history yet for the
// selected device.
export default function HistoryChart({ deviceId }) {
    const [points, setPoints] = useState(null); // null = not loaded yet

    useEffect(() => {
        if (!deviceId) return;

        let cancelled = false;

        getHistory(deviceId)
            .then((rows) => {
                if (cancelled) return;

                const mapped = rows.map((row) => ({
                    time: row.created_at,
                    temperature: Number(row.temperature),
                    humidity: Number(row.humidity),
                    airQuality: Number(row.air_quality),
                }));

                setPoints(mapped);
            })
            .catch(() => {
                if (!cancelled) setPoints([]);
            });

        return () => {
            cancelled = true;
        };
    }, [deviceId]);

    if (!deviceId) {
        return <NoHistoryMessage />;
    }

    if (points === null) {
        return (
            <div className="text-[11px] text-slate-400 text-center py-6 border border-slate-200 rounded bg-slate-50 font-bold">
                기록 불러오는 중...
            </div>
        );
    }

    if (points.length === 0) {
        return <NoHistoryMessage />;
    }

    return (
        <div className="bg-white border border-slate-200 rounded p-2" style={{ height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={points} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" tick={{ fontSize: 9 }} hide />
                    <YAxis tick={{ fontSize: 9 }} width={28} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="temperature" stroke="#059669" dot={false} strokeWidth={2} name="온도" />
                    <Line type="monotone" dataKey="humidity" stroke="#2563eb" dot={false} strokeWidth={2} name="습도" />
                    <Line type="monotone" dataKey="airQuality" stroke="#b45309" dot={false} strokeWidth={2} name="공기질(평균)" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
