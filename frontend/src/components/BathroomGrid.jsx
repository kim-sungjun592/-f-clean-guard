import BathroomCard from "./BathroomCard";

// Responsive grid replacing the old flat device table. Bathrooms are
// whatever the caller passes in (already filtered by building, if any) —
// this component does not fetch or hardcode data itself.
export default function BathroomGrid({ bathrooms, selectedRow, setSelectedRow }) {
    if (bathrooms.length === 0) {
        return (
            <div className="bg-white border border-slate-300 rounded shadow-xs p-8 text-center text-xs text-slate-400 font-bold">
                표시할 화장실이 없습니다.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {bathrooms.map((data) => (
                <BathroomCard
                    key={data.id}
                    data={data}
                    isSelected={selectedRow?.id === data.id}
                    onSelect={setSelectedRow}
                />
            ))}
        </div>
    );
}
