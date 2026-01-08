import React, { useState } from "react";

export default function Sidebar({
  username,
  token,
  onLogin,
  onRegister,
  onLogout,
  roomId,
  setRoomId,
  personalMode,
  setPersonalMode,
}) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  return (
    <aside className="w-80 bg-gray-900 text-gray-100 flex flex-col">
      <div className="px-4 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">💬 ChatCollab</h1>
        <p className="text-xs text-gray-400 mt-1">Pro dashboard</p>
      </div>

      <div className="px-4 py-3 border-b border-gray-800">
        <label className="text-xs text-gray-400">Room</label>
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full mt-2 px-3 py-2 bg-gray-800 rounded text-gray-100 placeholder-gray-400"
          placeholder="room id"
        />
        <div className="flex items-center mt-3">
          <input id="personal" checked={personalMode} onChange={(e) => setPersonalMode(e.target.checked)} type="checkbox" />
          <label htmlFor="personal" className="ml-2 text-sm text-gray-300">Personal mode</label>
        </div>
      </div>

      <div className="px-4 py-4 flex-1 overflow-auto">
        {token ? (
          <div className="p-3 bg-gray-800 rounded">
            <div className="text-sm">Signed in as</div>
            <div className="font-medium mt-1">{username}</div>
            <button onClick={onLogout} className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white rounded px-3 py-2">Logout</button>
          </div>
        ) : (
          <div className="space-y-2">
            <input className="w-full px-3 py-2 bg-gray-800 rounded text-gray-100" placeholder="username" value={u} onChange={e=>setU(e.target.value)} />
            <input className="w-full px-3 py-2 bg-gray-800 rounded text-gray-100" placeholder="password" type="password" value={p} onChange={e=>setP(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={() => onRegister(u,p).then(r => alert(r.ok ? 'Registered!' : (r.error||'Error')))} className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded">Register</button>
              <button onClick={() => onLogin(u,p).then(r => alert(r.ok ? 'Logged in!' : (r.error||'Login failed')))} className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2 rounded">Login</button>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-800 text-xs text-gray-400">
        <div>Shortcuts</div>
        <div className="mt-2">Press <kbd className="px-1 bg-gray-700 rounded">Ctrl</kbd> + <kbd className="px-1 bg-gray-700 rounded">S</kbd> to save</div>
      </div>
    </aside>
  );
}
