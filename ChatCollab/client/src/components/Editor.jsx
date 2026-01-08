import React, { useEffect, useRef, useState } from "react";

let MonacoEditor = null;
try {

  MonacoEditor = require("@monaco-editor/react").default;
} catch (e) {
  MonacoEditor = null;
}

export default function Editor({ socket, roomId }) {
  const [value, setValue] = useState("// Start typing code...\n");
  const saveTimer = useRef(null);

  useEffect(() => {
    if (!socket || !roomId) return;
    socket.emit("join-room", { roomId });
    socket.on("init-document", ({ content }) => {
      setValue(content || "");
    });
    socket.on("code-update", ({ content }) => {
      setValue(content);
    });
    return () => {
      socket.off("init-document");
      socket.off("code-update");
    };
  }, [socket, roomId]);

  function onChange(next) {
    setValue(next);
    if (!socket) return;
    socket.emit("code-change", { roomId, content: next });

    // debounce saving personal doc (if socket.user set server-side)
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      socket.emit("save-personal", { code: next });
    }, 1000);
  }

  // If Monaco available, render it; otherwise use textarea
  if (MonacoEditor) {
    return (
      <div className="h-full">
        <MonacoEditor
          height="100%"
          defaultLanguage="javascript"
          value={value}
          theme="vs-dark"
          onChange={(v) => onChange(v)}
          options={{ minimap: { enabled: false }, fontSize: 13 }}
        />
      </div>
    );
  }

  // textarea fallback (styled)
  return (
    <div className="h-full p-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full font-mono text-sm bg-slate-50 border border-gray-200 rounded-lg p-3 focus:outline-none"
      />
    </div>
  );
}
