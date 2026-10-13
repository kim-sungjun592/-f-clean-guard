import { useHistoryLog } from "../hooks/useHistoryLog";
import { getStatusInfo } from "../utils/status";

function HistoryRow({ row, onTap }) {
  const status = getStatusInfo(
    Number(row.temperature),
    Number(row.humidity),
    row.air_quality
  );

  return (
    <button
      type="button"
      onClick={() => onTap(row)}
      className={`w-full text-left bg-white rounded-2xl border ${status.border} shadow-sm active:scale-[0.98] transition-transform p-4 mb-3`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-black text-sm truncate">{row.created_at}</div>
        <span className={`${status.text} text-[11px] font-bold shrink-0`}>{status.label}</span>
      </div>

      <div className="text-xs text-slate-500 font-bold mt-0.5 truncate">
        {row.id}
        {row.NAME ? ` · ${row.NAME}` : ""}
        {row.location ? ` · ${row.location}` : ""}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <div className="text-[9px] text-slate-500 font-bold">온도</div>
          <div className="font-black text-sm">{row.temperature}°C</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <div className="text-[9px] text-slate-500 font-bold">습도</div>
          <div className="font-black text-sm">{row.humidity}%</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <div className="text-[9px] text-slate-500 font-bold">공기질</div>
          <div className="font-black text-sm truncate">{row.air_quality}</div>
        </div>
      </div>
    </button>
  );
}

// Mounted only while History mode is active (see MobileDashboard.jsx), so
// useHistoryLog() -- which always fetches page 1 on mount with no
// interval -- only ever runs when the user is actually looking at
// History. Mirrors the desktop HistoryPanel/HistoryLog behavior: every
// individual measurement, newest first, paginated, no auto-refresh.
export default function MobileHistoryList({ onSelectRow }) {
  const { records, total, loading, hasMore, loadMore } = useHistoryLog();

  return (
    <>
      <div className="bg-white border-b border-slate-200 px-4 py-2 text-xs font-bold text-slate-500 flex items-center justify-between">
        <span>
          히스토리 모드 <span className="text-slate-900">(자동 갱신 없음)</span>
        </span>
        <span>{records.length} / {total}건</span>
      </div>

      <main
        className="flex-1 overflow-y-auto px-4 py-3"
        style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
      >
        {records.length === 0 && !loading && (
          <div className="bg-white border border-slate-300 rounded-2xl shadow-sm p-8 text-center text-sm text-slate-400 font-bold">
            기록이 없습니다.
          </div>
        )}

        {records.map((row) => (
          <HistoryRow key={row.reading_id} row={row} onTap={onSelectRow} />
        ))}

        {loading && records.length === 0 && (
          <div className="text-center text-sm text-slate-400 font-bold py-6">불러오는 중...</div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-2 mb-4">
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold disabled:opacity-50 active:scale-95 transition-transform"
            >
              {loading ? "불러오는 중..." : "더 보기"}
            </button>
          </div>
        )}
      </main>
    </>
  );
}
