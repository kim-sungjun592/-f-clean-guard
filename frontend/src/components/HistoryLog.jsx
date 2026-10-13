import { getStatusInfo } from "../utils/status";

function LogRow({ row, isSelected, onSelect }) {
    const status = getStatusInfo(Number(row.temperature), Number(row.humidity), row.air_quality);

    return (
        <div
            onClick={() => onSelect(row)}
            className={`cursor-pointer bg-white border rounded shadow-xs p-3 text-xs transition-colors duration-75 ${status.bg} border-slate-300 ${
                isSelected ? "ring-2 ring-inset ring-slate-800 font-semibold" : ""
            }`}
        >
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-black text-sm">{row.created_at}</div>
                <span className={`${status.text} text-[10px] font-bold`}>{status.label}</span>
            </div>

            <div className="text-[10px] text-slate-500 font-bold mt-0.5 truncate">
                {row.id}{row.NAME ? ` · ${row.NAME}` : ""}{row.location ? ` · ${row.location}` : ""}
            </div>

            <div className="grid grid-cols-3 gap-1 mt-2">
                <div className="bg-white/70 border border-slate-200 rounded p-1 text-center">
                    <div className="text-[9px] text-slate-500 font-bold">온도</div>
                    <div className="font-black">{row.temperature}°C</div>
                </div>
                <div className="bg-white/70 border border-slate-200 rounded p-1 text-center">
                    <div className="text-[9px] text-slate-500 font-bold">습도</div>
                    <div className="font-black">{row.humidity}%</div>
                </div>
                <div className="bg-white/70 border border-slate-200 rounded p-1 text-center">
                    <div className="text-[9px] text-slate-500 font-bold">공기질</div>
                    <div className="font-black truncate">{row.air_quality}</div>
                </div>
            </div>
        </div>
    );
}

// History mode's log view: every individual measurement, newest first, as
// a single-column vertical list (so the newest-first chronological order
// reads top-to-bottom without the eye jumping between columns -- and, as
// a side effect, this is inherently mobile-friendly with no separate
// responsive treatment needed). Rows are clickable and reuse the existing
// SidePanel + HistoryChart for per-device detail/trend, exactly like the
// Live/Test bathroom grid does.
export default function HistoryLog({ records, loading, hasMore, onLoadMore, selectedRow, onSelectRow }) {
    if (records.length === 0 && !loading) {
        return (
            <div className="bg-white border border-slate-300 rounded shadow-xs p-8 text-center text-xs text-slate-400 font-bold">
                기록이 없습니다.
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-2">
                {records.map((row) => (
                    <LogRow
                        key={row.reading_id}
                        row={row}
                        isSelected={selectedRow?.reading_id === row.reading_id}
                        onSelect={onSelectRow}
                    />
                ))}
            </div>

            {loading && records.length === 0 && (
                <div className="text-center text-xs text-slate-400 font-bold py-6">
                    불러오는 중...
                </div>
            )}

            {hasMore && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={onLoadMore}
                        disabled={loading}
                        className="px-5 py-2.5 rounded bg-slate-900 text-white text-xs font-bold disabled:opacity-50"
                    >
                        {loading ? "불러오는 중..." : "더 보기 (Load more)"}
                    </button>
                </div>
            )}
        </div>
    );
}
