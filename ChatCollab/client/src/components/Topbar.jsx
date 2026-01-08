import React from "react";

export default function Topbar() {
  return (
    <header className="h-14 bg-white/80 backdrop-blur sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold shadow">CC</div>
          <div>
            <div className="text-sm font-semibold">ChatCollab</div>
            <div className="text-xs text-gray-500">Realtime collaboration</div>
          </div>
        </div>

        <nav className="flex items-center space-x-4 text-sm text-gray-600">
          <button className="px-3 py-1 rounded hover:bg-gray-100">Docs</button>
          <button className="px-3 py-1 rounded hover:bg-gray-100">Settings</button>
        </nav>
      </div>
    </header>
  );
}
