export default function SummaryBar({ summary }) {
    return (
        <section className="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold">
                <div className="text-slate-500">
                    총 화장실: <span className="text-slate-900 text-sm font-black">{summary.total}</span>
                </div>
                <div className="flex items-center flex-wrap gap-3 md:border-l border-slate-200 md:pl-6">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        정상: {summary.normal}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        경고: {summary.warning}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">
                        위험: {summary.danger}
                    </span>
                </div>
            </section>
    );
}
