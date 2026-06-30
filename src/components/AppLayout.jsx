import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import CosmicBackground from "./CosmicBackground";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen text-white flex" style={{ background: "#0B0F19", position: "relative", zIndex: 1 }}>
      <CosmicBackground />
      <div style={{ position: "relative", zIndex: 2, display: "flex", flex: 1, minWidth: 0 }}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-col flex-1 min-w-0">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
