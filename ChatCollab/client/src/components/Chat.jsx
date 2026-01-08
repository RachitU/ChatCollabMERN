import React, { useEffect, useRef, useState } from "react";

export default function Chat({ socket, roomId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scroller = useRef();

  useEffect(() => {
    if (!socket || !roomId) return;
    socket.emit("join-room", { roomId });

    const onChat = (m) => {
      setMessages((s) => [...s, m]);
      setTimeout(() => scroller.current?.scrollTo(0, scroller.current.scrollHeight), 10);
    };

    socket.on("chat-message", onChat);
    return () => socket.off("chat-message", onChat);
  }, [socket, roomId]);

  function send() {
    if (!text.trim() || !socket) return;
    socket.emit("chat-message", { roomId, message: text });
    setText("");
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scroller} className="flex-1 overflow-auto p-2 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-full ${m.username === "You" ? "ml-auto" : ""}`}>
            <div className="inline-block bg-gray-100 p-2 rounded-lg shadow-sm">
              <div className="text-xs text-gray-500">{m.username || "Anon"}</div>
              <div className="text-sm mt-1">{m.message}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 px-3 py-2 rounded border"
            placeholder="Type a message..."
          />
          <button onClick={send} className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
        </div>
      </div>
    </div>
  );
}
