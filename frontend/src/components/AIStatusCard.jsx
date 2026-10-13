import { useState } from "react";

// AI Analysis placeholder.
//
// The AI model now runs on a separate server a teammate is providing for
// the live demonstration -- this dashboard does not poll or compute any
// prediction itself. This card only prepares the UI: a static "AI TEST"
// button that will be wired to that server later. Clicking it today just
// gives the operator visible feedback that the control exists and works;
// it makes no network call.
export default function AIStatusCard() {
  const [tested, setTested] = useState(false);

  return (
    <div className="bg-white border rounded p-3">
      <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">
        AI Analysis
      </div>

      <div className="text-[11px] text-slate-400 font-bold text-center py-3 border border-dashed border-slate-300 rounded bg-slate-50 mb-2">
        AI 분석은 시연 시 별도 서버와 연결됩니다.
      </div>

      <button
        type="button"
        onClick={() => setTested(true)}
        className="w-full py-2 rounded border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold active:scale-95 transition-transform"
      >
        AI TEST
      </button>

      {tested && (
        <div className="text-[10px] text-slate-400 font-bold text-center mt-2">
          연결은 시연 시 별도 서버와 함께 준비됩니다.
        </div>
      )}
    </div>
  );
}
