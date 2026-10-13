import { getLevelMeta } from "../utils/status";

// Building card for the landscape/tablet dashboard -- structurally similar
// to the reviewer's reference image (name, bathroom count, monitoring
// status, AI status, three colored indicators) while reusing this
// project's existing card styling and status color language
// (getLevelMeta) instead of copying the reference's exact visual design.
//
// AI status is a static label, not a fetch -- the real AI connection is
// provided by a separate server for the demonstration (see AIStatusCard),
// so this card never polls or fabricates an AI result.
export default function BuildingCard({ building, onSelect }) {
  const meta = getLevelMeta(building.status);

  return (
    <button
      type="button"
      onClick={() => onSelect(building.name)}
      className={`text-left bg-white rounded-2xl border ${meta.border} shadow-sm active:scale-[0.98] transition-transform p-4`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-black text-base text-slate-900 truncate">{building.name}</span>
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${meta.dot}`}></span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <div className="text-[9px] text-slate-500 font-bold">전체 화장실</div>
          <div className="font-black text-lg">{building.count}개</div>
        </div>
        <div className={`rounded-lg p-2 text-center ${meta.bg}`}>
          <div className="text-[9px] text-slate-500 font-bold">모니터링 상태</div>
          <div className={`font-black text-sm mt-0.5 ${meta.text}`}>{meta.label}</div>
        </div>
      </div>

      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-2 text-center mb-3">
        <div className="text-[9px] text-slate-500 font-bold">AI 상태</div>
        <div className="text-xs font-bold text-slate-400 mt-0.5">준비중</div>
      </div>

      <div className="flex items-center justify-between gap-1 text-[10px] font-bold">
        <span className="flex-1 text-center py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
          정상 {building.normalCount}
        </span>
        <span className="flex-1 text-center py-1 rounded bg-amber-100 text-amber-800 border border-amber-300">
          경고 {building.warningCount}
        </span>
        <span className="flex-1 text-center py-1 rounded bg-red-100 text-red-800 border border-red-300">
          위험 {building.dangerCount}
        </span>
      </div>
    </button>
  );
}
