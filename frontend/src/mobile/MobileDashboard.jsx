import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BuildingSelector from "../components/BuildingSelector";
import MobileSummaryCards from "./MobileSummaryCards";
import MobileBathroomCard from "./MobileBathroomCard";
import MobileHistoryList from "./MobileHistoryList";
import { useDashboardData } from "../hooks/useDashboardData";

// Mobile main screen: sticky header, mode selector (via the reused
// Header), summary cards, building selector, scrollable bathroom list.
// Live/Test render this screen's own list (useDashboardData already no-ops
// for "history"); History mode swaps the whole content area for
// MobileHistoryList, which is only mounted -- and therefore only
// fetching -- while History is actually selected.
export default function MobileDashboard() {
  const navigate = useNavigate();
  const [table, setTable] = useState("live");
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const isHistory = table === "history";
  const { buildings, filteredData, summary, loading, sensorData } = useDashboardData(
    table,
    selectedBuilding
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  function handleTableChange(next) {
    setTable(next);
    setSelectedBuilding(null);
  }

  function openBathroom(row) {
    navigate(`/bathroom/${encodeURIComponent(row.id)}?mode=${table}`, { state: { row } });
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-mono">
      <div className="sticky top-0 z-40">
        <Header currentTime={currentTime} table={table} setTable={handleTableChange} />
      </div>

      {isHistory ? (
        <MobileHistoryList
          onSelectRow={(row) =>
            navigate(`/bathroom/${encodeURIComponent(row.id)}?mode=history`, { state: { row } })
          }
        />
      ) : (
        <>
          <MobileSummaryCards summary={summary} />

          <BuildingSelector
            buildings={buildings}
            selectedBuilding={selectedBuilding}
            onSelect={(name) => setSelectedBuilding((prev) => (prev === name ? null : name))}
            totalCount={sensorData.length}
          />

          <main
            className="flex-1 overflow-y-auto px-4 py-3"
            style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
          >
            {loading && filteredData.length === 0 && (
              <div className="text-center text-sm text-slate-400 font-bold py-10">
                불러오는 중...
              </div>
            )}

            {!loading && filteredData.length === 0 && (
              <div className="bg-white border border-slate-300 rounded-2xl shadow-sm p-8 text-center text-sm text-slate-400 font-bold">
                표시할 화장실이 없습니다.
              </div>
            )}

            {filteredData.map((row) => (
              <MobileBathroomCard key={row.id} row={row} onTap={openBathroom} />
            ))}
          </main>
        </>
      )}
    </div>
  );
}
