// Header.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header({ currentTime, table, setTable }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900 text-white px-4 sm:px-6 py-3 border-b border-slate-700 shadow-sm">
      {/* DESKTOP / TABLET LAYOUT -- unchanged from the original design */}
      <div className="hidden md:grid grid-cols-3 items-center">
        {/* IZQUIERDA */}
        <div className="flex items-center gap-3">
          <Link
            to="/devices"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm"
          >
            장치 관리
          </Link>

          <select
            value={table}
            onChange={(e) => setTable(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="live">🟢 Live</option>
            <option value="test">🟡 Test</option>
            <option value="history">🔵 History</option>
          </select>
        </div>

        {/* CENTRO */}
        <div className="text-center">
          <h1 className="text-xl font-black text-emerald-400">CleanGuard</h1>

          <p className="text-xs text-slate-400">
            경복대 실시간 화장실 환경 모니터링 시스템
          </p>
        </div>

        {/* DERECHA */}
        <div className="flex justify-end items-center gap-4">
          <span className="text-sm">{currentTime}</span>

          <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>

            <span className="text-emerald-400 text-xs font-bold">ONLINE</span>
          </div>
        </div>
      </div>

      {/* MOBILE LAYOUT -- hamburger opens a drawer with the same nav
                link, mode selector, and status indicator the desktop header
                shows inline. Same colors/typography, just collapsed. */}
      <div className="flex md:hidden items-center justify-between">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="메뉴 열기"
          className="p-2 -ml-2 rounded-lg bg-slate-800 border border-slate-700 text-lg leading-none"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className="text-center">
          <h1 className="text-lg font-black text-emerald-400">CleanGuard</h1>
        </div>

        <span className="text-xs text-slate-300 min-w-[64px] text-right">
          {currentTime}
        </span>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-700 flex flex-col gap-3">
          <Link
            to="/devices"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-center"
          >
            장치 관리
          </Link>

          <select
            value={table}
            onChange={(e) => {
              setTable(e.target.value);
              setMenuOpen(false);
            }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm"
          >
            <option value="live">🟢 Live</option>
            <option value="test">🟡 Test</option>
            <option value="history">🔵 History</option>
          </select>

          <div className="flex items-center justify-center gap-2 bg-slate-800 px-3 py-2.5 rounded-lg border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-400 text-xs font-bold">ONLINE</span>
          </div>
        </div>
      )}
    </header>
  );
}
