import React, { useEffect, useState } from "react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Chat from "./components/Chat";
import { createSocket } from "./socket";
import "./styles.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "anon" + Math.floor(Math.random() * 1000)
  );
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState("public-room");
  const [personalMode, setPersonalMode] = useState(true);

  useEffect(() => {
    const s = createSocket(token || null);
    setSocket(s);
    return () => {
      if (s) s.close();
    };
  }, [token]);

  async function register(u, p) {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: u, password: p }),
    });
    return res.json();
  }

  async function login(u, p) {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username: u, password: p }),
    });
    const j = await res.json();
    if (j.ok) {
      localStorage.setItem("token", j.token);
      localStorage.setItem("username", j.user.username);
      setToken(j.token);
      setUsername(j.user.username);
    }
    return j;
  }

  function logout() {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("anon" + Math.floor(Math.random() * 1000));
  }

  const effectiveRoom = personalMode ? `personal:${username}` : roomId;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          username={username}
          token={token}
          onLogin={login}
          onRegister={register}
          onLogout={logout}
          roomId={roomId}
          setRoomId={setRoomId}
          personalMode={personalMode}
          setPersonalMode={setPersonalMode}
        />
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 p-4">
              <div className="h-full bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
                <div className="px-4 py-2 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Editor · {effectiveRoom}</h2>
                    <div className="text-sm text-gray-500">Realtime — Socket.io</div>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <Editor socket={socket} roomId={effectiveRoom} token={token} />
                </div>
              </div>
            </div>

            <aside className="w-96 p-4 bg-gray-50 border-l">
              <div className="h-full flex flex-col">
                <h3 className="font-semibold mb-2">Chat</h3>
                <div className="flex-1 mb-3">
                  <Chat socket={socket} roomId={effectiveRoom} />
                </div>

                <div className="text-xs text-gray-500">
                  Logged in as <strong>{username}</strong>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
