import { useHistoryLog } from "../hooks/useHistoryLog";
import HistoryLog from "./HistoryLog";
import SidePanel from "./SidePanel";

// Only ever mounted while History mode is selected (see Admin.jsx). That
// means useHistoryLog() always starts fresh -- page 1, empty list -- the
// moment History mode is entered, and its state is simply discarded when
// the user switches back to Live/Test. No manual reset plumbing needed.
export default function HistoryPanel({ selectedRow, setSelectedRow }) {
    const { records, total, loading, hasMore, loadMore } = useHistoryLog();

    return (
        <>
            {/* HISTORY STATUS BAR -- replaces SummaryBar/BuildingSelector for
                this mode: a historical log has no "current" building status,
                so it shows record counts and the disabled-auto-refresh state
                instead, using the same bar styling as the rest of the app. */}
            <section className="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs font-bold">
                <div className="text-slate-500">
                    히스토리 모드 <span className="text-slate-900">(자동 갱신 없음)</span>
                </div>
                <div className="text-slate-500">
                    표시 중: <span className="text-slate-900 text-sm font-black">{records.length}</span> / 총{" "}
                    <span className="text-slate-900">{total}</span>건
                </div>
            </section>

            <main className="flex-1 flex overflow-hidden relative">
                <section className="flex-1 p-4 overflow-auto">
                    <HistoryLog
                        records={records}
                        loading={loading}
                        hasMore={hasMore}
                        onLoadMore={loadMore}
                        selectedRow={selectedRow}
                        onSelectRow={setSelectedRow}
                    />
                </section>

                {selectedRow && (
                    <SidePanel
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                    />
                )}
            </main>
        </>
    );
}
