import { getLevelMeta } from "../utils/status";

// Building cards are rendered purely from data derived at runtime from the
// existing `location` field (see utils/location.js) — no building or room
// names are hardcoded here, so this works for any number of buildings.
export default function BuildingSelector({ buildings, selectedBuilding, onSelect, totalCount }) {
    if (buildings.length === 0) return null;

    return (
        <section className="bg-white border-b border-slate-200 px-4 py-3">
            <div className="text-[10px] font-black text-slate-500 uppercase mb-2">
                건물 선택
            </div>

            <div className="flex items-stretch gap-2 overflow-x-auto pb-1">
                <button
                    onClick={() => onSelect(null)}
                    className={`shrink-0 min-w-[120px] text-left px-3 py-2.5 sm:py-2 rounded border shadow-xs transition-colors duration-75 ${
                        selectedBuilding === null
                            ? "ring-2 ring-inset ring-slate-800 bg-slate-50 border-slate-400"
                            : "bg-white hover:bg-slate-50 border-slate-300"
                    }`}
                >
                    <div className="font-black text-xs">전체 보기</div>
                    <div className="text-[10px] text-slate-500 font-bold mt-1">
                        {totalCount}개 화장실
                    </div>
                </button>

                {buildings.map((b) => {
                    const meta = getLevelMeta(b.status);
                    const isSelected = selectedBuilding === b.name;

                    return (
                        <button
                            key={b.name}
                            onClick={() => onSelect(b.name)}
                            className={`shrink-0 min-w-[160px] text-left px-3 py-2.5 sm:py-2 rounded border shadow-xs transition-colors duration-75 ${
                                isSelected
                                    ? "ring-2 ring-inset ring-slate-800 bg-slate-50 border-slate-400"
                                    : "bg-white hover:bg-slate-50 border-slate-300"
                            }`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-black text-xs truncate">{b.name}</span>
                                <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dot}`}></span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-bold mt-1">
                                모니터링 화장실 {b.count}개
                            </div>
                            <div className={`text-[10px] font-bold mt-0.5 ${meta.text}`}>
                                {meta.label}
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
