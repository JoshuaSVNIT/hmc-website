"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { InstallPromptProvider } from "@/components/InstallPrompt";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <InstallPromptProvider>
      <div className="site-shell">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="site-main relative">
          <TopBar onMenuOpen={() => setSidebarOpen(true)} />
          <div className="flex-1 flex flex-col min-w-0">{children}</div>
          <Footer />
        </div>
      </div>
    </InstallPromptProvider>
  );
}
