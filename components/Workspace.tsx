"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import BrandKitClient from "@/app/brandkit/BrandKitClient";
import ContentPilotClient from "@/app/contentpilot/ContentPilotClient";

export type WorkspaceTab = "brandkit" | "contentpilot";

const WorkspaceContext = createContext<{ open: (tab: WorkspaceTab) => void }>({
  open: () => {},
});

export function useWorkspace() {
  return useContext(WorkspaceContext);
}

const TABS: { id: WorkspaceTab; label: string; sub: string; icon: ReactNode }[] = [
  {
    id: "brandkit",
    label: "BrandKit",
    sub: "ブランド素材を生成",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M12 2 2 7l10 5 10-5-10-5z" />
        <path d="M2 12l10 5 10-5" />
        <path d="M2 17l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: "contentpilot",
    label: "ContentPilot",
    sub: "AIでコンテンツ生成",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M12 3l1.8 4.8L18.6 9.6l-4.8 1.8L12 16.2l-1.8-4.8L5.4 9.6l4.8-1.8L12 3z" />
        <path d="M19 14l.7 1.8L21.5 16.5l-1.8.7L19 19l-.7-1.8-1.8-.7 1.8-.7L19 14z" />
      </svg>
    ),
  },
];

export function OpenWorkspaceButton({
  tab,
  className = "",
}: {
  tab: WorkspaceTab;
  className?: string;
}) {
  const { open } = useWorkspace();
  return (
    <button type="button" onClick={() => open(tab)} className={className}>
      Mikkoを試す
      <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
    </button>
  );
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<WorkspaceTab | null>(null);
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const open = useCallback((t: WorkspaceTab) => {
    setTab(t);
    setEntered(false);
    setClosing(false);
  }, []);

  const close = useCallback(() => {
    if (closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setTab(null);
      setClosing(false);
      setEntered(false);
    }, 240);
  }, [closing]);

  useEffect(() => {
    if (!tab) return;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [tab, close]);

  useEffect(() => {
    if (!tab) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [tab]);

  const panelVisible = entered && !closing;
  const panelClass = `absolute inset-0 flex transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
    panelVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-[0.97] opacity-0"
  }`;

  return (
    <WorkspaceContext.Provider value={{ open }}>
      {children}
      {tab && (
        <div
          className="fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label="Mikko ワークスペース"
        >
          <div
            onClick={close}
            className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
              closing ? "opacity-0" : "opacity-100"
            }`}
          />
          <div className={panelClass}>
            <aside className="flex w-16 shrink-0 flex-col border-r border-white/10 bg-zinc-950 text-white md:w-64">
              <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-3 md:px-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#6366F1] text-sm font-black text-white">
                  M
                </span>
                <span className="hidden font-display text-lg font-bold tracking-tight md:block">
                  Mikko
                </span>
              </div>
              <nav className="flex-1 space-y-1 p-2 md:p-3">
                {TABS.map((t) => {
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTab(t.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition md:px-3 ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                          active
                            ? "bg-gradient-to-br from-[#3B82F6] to-[#6366F1] text-white"
                            : "bg-white/5 text-zinc-300"
                        }`}
                      >
                        {t.icon}
                      </span>
                      <span className="hidden md:block">
                        <span className="block text-sm font-bold">{t.label}</span>
                        <span className="block text-[11px] text-zinc-500">{t.sub}</span>
                      </span>
                    </button>
                  );
                })}
              </nav>
              <div className="border-t border-white/10 p-2 md:p-3">
                <button
                  type="button"
                  onClick={close}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
                >
                  <span className="text-base leading-none">✕</span>
                  <span className="hidden md:inline">閉じる</span>
                </button>
              </div>
            </aside>
            <main className="flex-1 overflow-y-auto bg-base">
              <div className={tab === "brandkit" ? "" : "hidden"}>
                <BrandKitClient />
              </div>
              <div className={tab === "contentpilot" ? "" : "hidden"}>
                <ContentPilotClient />
              </div>
            </main>
          </div>
        </div>
      )}
    </WorkspaceContext.Provider>
  );
}
