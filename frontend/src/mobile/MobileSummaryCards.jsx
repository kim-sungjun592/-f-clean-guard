// Total / Normal / Warning / Danger summary cards.
// Pure presentational component -- the counts are computed by the caller
// from the same status levels getStatusInfo() already produces, so there
// is no duplicated status logic here.
//
// `showTotal` is off by default so the existing portrait mobile screen
// (3 cards: Normal/Warning/Danger) stays exactly as it was. The landscape/
// tablet dashboard passes showTotal to reuse this same component with a
// 4th "Total" card instead of a separate, near-identical component.
export default function MobileSummaryCards({ summary, showTotal = false }) {
  const cards = [
    ...(showTotal
      ? [
          {
            key: "total",
            label: "전체",
            value: summary.total,
            bg: "bg-slate-50",
            border: "border-slate-300",
            text: "text-slate-700",
            dot: "bg-slate-500",
          },
        ]
      : []),
    {
      key: "normal",
      label: "정상",
      value: summary.normal,
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    {
      key: "warning",
      label: "경고",
      value: summary.warning,
      bg: "bg-amber-50",
      border: "border-amber-300",
      text: "text-amber-700",
      dot: "bg-amber-500",
    },
    {
      key: "danger",
      label: "위험",
      value: summary.danger,
      bg: "bg-red-50",
      border: "border-red-300",
      text: "text-red-700",
      dot: "bg-red-500",
    },
  ];

  return (
    <div className={`grid gap-2 px-4 py-3 ${showTotal ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
      {cards.map((c) => (
        <div
          key={c.key}
          className={`rounded-2xl border ${c.bg} ${c.border} px-2 py-3 text-center`}
        >
          <span className={`inline-block w-2 h-2 rounded-full ${c.dot} mb-1`}></span>
          <div className={`text-xl font-black ${c.text}`}>{c.value}</div>
          <div className="text-[10px] font-bold text-slate-500 mt-0.5">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
