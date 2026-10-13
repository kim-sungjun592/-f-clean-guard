import { useEffect, useState } from "react";
import Header from "../components/Header";
import HistoryPanel from "../components/HistoryPanel";
import BathroomGrid from "../components/BathroomGrid";
import SidePanel from "../components/SidePanel";
import MobileSummaryCards from "../mobile/MobileSummaryCards";
import BuildingCard from "./BuildingCard";
import { useDashboardData } from "../hooks/useDashboardData";

// Landscape/tablet dashboard -- shown automatically (see useLayoutMode)
// for landscape phones and tablets in either orientation, structurally
// inspired by the reviewer's reference: title/time header, four summary
// cards, then a grid of building cards. Selecting a building drops into
// that building's existing bathroom grid; selecting a bathroom reuses the
// existing side detail panel. Nothing here recomputes data that
// useDashboardData/BathroomGrid/SidePanel/HistoryPanel don't already
// provide -- this file is purely a new arrangement of existing pieces.
export default function LandscapeDashboard() {
  const [table, setTable] = useState("live");
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const isHistory = table === "history";
  const { buildings, filteredData, summary, loading } = useDashboardData(table, selectedBuilding);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  function handleTableChange(next) {
    setTable(next);
    setSelectedBuilding(null);
    setSelectedRow(null);
  }

  function backToBuildings() {
    setSelectedBuilding(null);
    setSelectedRow(null);
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-mono">
      <Header currentTime={currentTime} table={table} setTable={handleTableChange} />

      {isHistory ? (
        <HistoryPanel selectedRow={selectedRow} setSelectedRow={setSelectedRow} />
      ) : selectedBuilding ? (
        <>
          <section className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-3">
            <button
              type="button"
              onClick={backToBuildings}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-300"
            >
              ← 건물 목록
            </button>
            <span className="font-black text-sm text-slate-800">{selectedBuilding}</span>
          </section>

          <main className="flex-1 flex overflow-hidden relative">
            <section className="flex-1 p-4 overflow-auto">
              <BathroomGrid
                bathrooms={filteredData}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
              />
            </section>

            {selectedRow && (
              <SidePanel selectedRow={selectedRow} setSelectedRow={setSelectedRow} />
            )}
          </main>
        </>
      ) : (
        <main className="flex-1 overflow-y-auto">
          <MobileSummaryCards summary={summary} showTotal />

          <section className="px-4 pb-4">
            {loading && buildings.length === 0 && (
              <div className="text-center text-sm text-slate-400 font-bold py-10">
                불러오는 중...
              </div>
            )}

            {!loading && buildings.length === 0 && (
              <div className="bg-white border border-slate-300 rounded-2xl shadow-sm p-8 text-center text-sm text-slate-400 font-bold">
                표시할 건물이 없습니다.
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {buildings.map((b) => (
                <BuildingCard key={b.name} building={b} onSelect={setSelectedBuilding} />
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
