import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiBellFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { getIsAdmin } from "../../../utils/getStoredUser";
import type { Notif } from "./types";
import { getNotifications } from "../../../modules/dashboard/api/notifications";
import { chime, unlockAudio } from "./audio";
import { DEMO_NOTIFICATIONS, TYPE_CFG } from "./constants";
import ToastCard from "./ToastCard";
import NotificationDropdown from "./NotificationDropdown";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClearedEntry {
  id: string;
  clearedAt: number;
}

const CLEAR_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms

// ─── localStorage helpers ─────────────────────────────────────────────────────

const loadClearedIds = (): Set<string> => {
  try {
    const stored = localStorage.getItem("notif-cleared");
    if (!stored) return new Set();
    const entries: ClearedEntry[] = JSON.parse(stored);
    const now = Date.now();
    const valid = entries.filter((e) => now - e.clearedAt < CLEAR_TTL);
    localStorage.setItem("notif-cleared", JSON.stringify(valid));
    return new Set(valid.map((e) => e.id));
  } catch {
    // localStorage unavailable — silently ignore
    return new Set();
  }
};

const saveClearedEntries = (entries: ClearedEntry[]) => {
  try {
    const now = Date.now();
    const valid = entries.filter((e) => now - e.clearedAt < CLEAR_TTL);
    localStorage.setItem("notif-cleared", JSON.stringify(valid));
  } catch {
    // localStorage unavailable — silently ignore
  }
};

// ─── NotificationBell ─────────────────────────────────────────────────────────

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Read state — persists indefinitely
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("notif-read-ids");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      // localStorage unavailable — silently ignore
      return new Set();
    }
  });

  // Cleared state — auto-expires after 24hrs
  const [clearedIds, setClearedIds] = useState<Set<string>>(loadClearedIds);

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [soundOn, setSoundOn] = useState(true);
  const [toasts, setToasts] = useState<Notif[]>([]);
  const [bellRect, setBellRect] = useState<DOMRect | null>(null);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const prevIds = useRef<Set<string>>(new Set());
  const initialised = useRef(false);
  const bellBtnRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  // Stable refs for values used inside WebSocket/BroadcastChannel callbacks
  // This prevents socket reconnects when these values change
  const soundOnRef = useRef(soundOn);
  const readIdsRef = useRef(readIds);
  const clearedIdsRef = useRef(clearedIds);

  const navigate = useNavigate();
  const isAdmin = getIsAdmin();

  // ── Keep refs in sync with state ─────────────────────────────────────────
  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);
  useEffect(() => {
    readIdsRef.current = readIds;
  }, [readIds]);
  useEffect(() => {
    clearedIdsRef.current = clearedIds;
  }, [clearedIds]);

  // ── Persist read state ───────────────────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem("notif-read-ids", JSON.stringify([...readIds]));
    } catch {
      // localStorage unavailable — silently ignore
    }
  }, [readIds]);

  // ── Close on outside click ───────────────────────────────────────────────
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Restore tab title on focus ───────────────────────────────────────────
  useEffect(() => {
    const h = () => {
      document.title = "Abroad Scholars CRM";
    };
    window.addEventListener("focus", h);
    return () => window.removeEventListener("focus", h);
  }, []);

  // ── Request browser notification permission ──────────────────────────────
  useEffect(() => {
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, []);

  // ── Polling fallback ─────────────────────────────────────────────────────
  const {
    data: allNotifsRaw = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  // ── Refetch on tab visible ───────────────────────────────────────────────
  useEffect(() => {
    const h = () => {
      if (!document.hidden) refetch();
    };
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, [refetch]);

  // ── WebSocket connection ─────────────────────────────────────────────────
  // Uses refs for soundOn/readIds/clearedIds to avoid reconnecting on state change
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = io(`${import.meta.env.VITE_API_URL}/notifications`, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("notifications:init", () => {
      refetch();
    });

    socket.on("notification:new", (notif: Notif) => {
      // Use refs — always current values without causing reconnects
      if (
        readIdsRef.current.has(notif.id) ||
        clearedIdsRef.current.has(notif.id)
      )
        return;

      refetch();

      if (bellBtnRef.current)
        setBellRect(bellBtnRef.current.getBoundingClientRect());
      setToasts((prev) => [notif, ...prev].slice(0, 3));

      if (soundOnRef.current) chime();
      broadcastRef.current?.postMessage(notif);

      // Always show browser notification — visible on any tab/window
      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        const bn = new Notification(TYPE_CFG[notif.type].label, {
          body: `${notif.title}\n${notif.subtitle}`,
          icon: "/favicon.ico",
          tag: notif.id,
          requireInteraction: notif.priority === "high",
        });
        bn.onclick = () => {
          window.focus();
          bn.close();
          navigate(
            `/admin/leads-pipeline${notif.leadId ? `?leadId=${notif.leadId}` : ""}`,
          );
        };
      }

      // Always update tab title
      document.title = `(1) New — Abroad Scholars CRM`;
    });

    socket.on("connect_error", (err) => {
      console.warn("WS connect error:", err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [refetch, navigate]); // ← only stable deps — socket connects once and stays

  // ── Cross-tab notifications via BroadcastChannel ─────────────────────────
  // Uses refs to avoid recreating channel on state change
  useEffect(() => {
    const channel = new BroadcastChannel("notif-channel");
    broadcastRef.current = channel;

    channel.onmessage = (e) => {
      const notif: Notif = e.data;
      if (
        readIdsRef.current.has(notif.id) ||
        clearedIdsRef.current.has(notif.id)
      )
        return;
      refetch();
      if (bellBtnRef.current)
        setBellRect(bellBtnRef.current.getBoundingClientRect());
      setToasts((prev) => [notif, ...prev].slice(0, 3));
      if (soundOnRef.current) chime();
    };

    return () => channel.close();
  }, [refetch]); // ← stable dep only

  // ── Build notifs — filter out cleared ───────────────────────────────────
  const allNotifs = useMemo<Notif[]>(() => {
    const base = allNotifsRaw.length > 0 ? allNotifsRaw : DEMO_NOTIFICATIONS;
    return base
      .map((n) => ({ ...n, read: readIds.has(n.id) }))
      .filter((n) => !clearedIds.has(n.id)) // hide cleared for 24hrs
      .slice(0, 20);
  }, [allNotifsRaw, readIds, clearedIds]);

  // ── Detect new notifications (polling path) ──────────────────────────────
  useEffect(() => {
    if (!initialised.current) {
      allNotifs.forEach((n) => prevIds.current.add(n.id));
      initialised.current = true;
      return;
    }

    const brandNew = allNotifs.filter(
      (n) => !prevIds.current.has(n.id) && !readIds.has(n.id),
    );
    if (brandNew.length === 0) return;

    brandNew.forEach((n) => prevIds.current.add(n.id));

    if (soundOn) chime();

    brandNew.slice(0, 3).forEach((n, i) => {
      setTimeout(() => {
        if (bellBtnRef.current)
          setBellRect(bellBtnRef.current.getBoundingClientRect());
        setToasts((prev) => [n, ...prev].slice(0, 3));
      }, i * 350);
    });

    // Browser notification for polling-detected new leads
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      brandNew.slice(0, 2).forEach((n) => {
        const bn = new Notification(TYPE_CFG[n.type].label, {
          body: `${n.title}\n${n.subtitle}`,
          icon: "/favicon.ico",
          tag: n.id,
          requireInteraction: n.priority === "high",
        });
        bn.onclick = () => {
          window.focus();
          bn.close();
          navigate(
            `/admin/leads-pipeline${n.leadId ? `?leadId=${n.leadId}` : ""}`,
          );
        };
      });
    }

    const unread = allNotifs.filter((n) => !readIds.has(n.id)).length;
    if (unread > 0) document.title = `(${unread}) New — Abroad Scholars CRM`;
  }, [allNotifs, soundOn, readIds, navigate]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const dismissToast = useCallback(
    (id: string) => setToasts((p) => p.filter((t) => t.id !== id)),
    [],
  );

  const unreadCount = allNotifs.filter((n) => !n.read).length;

  const markAllRead = () => {
    setReadIds(new Set(allNotifs.map((n) => n.id)));
    setFilter("unread");
  };

  // Clear all — hides notifications for 24hrs then auto-reappears
  const clearAll = () => {
    const now = Date.now();

    let existing: ClearedEntry[] = [];
    try {
      const stored = localStorage.getItem("notif-cleared");
      if (stored) existing = JSON.parse(stored);
    } catch {
      // localStorage unavailable — silently ignore
    }

    const newEntries: ClearedEntry[] = allNotifs.map((n) => ({
      id: n.id,
      clearedAt: now,
    }));

    const merged = [
      ...existing.filter((e) => !newEntries.find((ne) => ne.id === e.id)),
      ...newEntries,
    ];

    saveClearedEntries(merged);
    setClearedIds(new Set(merged.map((e) => e.id)));
    setReadIds(new Set(allNotifs.map((n) => n.id)));
    setFilter("all");
  };

  const goToLead = (n: Notif) => {
    setReadIds((p) => new Set([...p, n.id]));
    setOpen(false);
    navigate(`/admin/leads-pipeline${n.leadId ? `?leadId=${n.leadId}` : ""}`);
  };

  const handleBellClick = () => {
    unlockAudio();
    if (bellBtnRef.current)
      setBellRect(bellBtnRef.current.getBoundingClientRect());
    setOpen((p) => !p);
  };

  return (
    <>
      {/* ── Toast portal ── */}
      {createPortal(
        <div
          className="fixed bottom-6 right-5 z-[99999] flex flex-col-reverse gap-2.5 pointer-events-none"
          style={{ width: 320 }}
        >
          <AnimatePresence mode="popLayout">
            {toasts.map((t) => (
              <div key={t.id} className="pointer-events-auto">
                <ToastCard
                  n={t}
                  bellRect={bellRect}
                  onDismiss={() => dismissToast(t.id)}
                  onClick={() => {
                    dismissToast(t.id);
                    goToLead(t);
                  }}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}

      {/* ── Bell button ── */}
      <div className="relative" ref={wrapRef}>
        <button
          ref={bellBtnRef}
          onClick={handleBellClick}
          className={`relative w-10 h-10 flex items-center justify-center rounded-xl border-2 transition-all duration-200 cursor-pointer outline-none group ${
            open
              ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-200"
              : unreadCount > 0
                ? "bg-white border-blue-200 hover:border-blue-400 hover:bg-blue-50 shadow-sm shadow-blue-100"
                : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <motion.div
            animate={
              unreadCount > 0 && !open
                ? { rotate: [0, -18, 18, -12, 12, -6, 6, 0] }
                : {}
            }
            transition={{ duration: 0.65, repeat: Infinity, repeatDelay: 5 }}
          >
            <RiBellFill
              size={17}
              className={
                open
                  ? "text-white"
                  : unreadCount > 0
                    ? "text-blue-600"
                    : "text-slate-400 group-hover:text-slate-600"
              }
            />
          </motion.div>

          {/* Badge */}
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0, y: 3 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-0.5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow z-10"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Ping ring */}
          {unreadCount > 0 && !open && (
            <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-red-400 opacity-25 animate-ping z-0" />
          )}
        </button>

        {/* ── Dropdown ── */}
        <AnimatePresence>
          {open && (
            <NotificationDropdown
              allNotifs={allNotifs}
              isLoading={isLoading}
              filter={filter}
              soundOn={soundOn}
              unreadCount={unreadCount}
              onClose={() => setOpen(false)}
              onRefetch={refetch}
              onMarkAllRead={markAllRead}
              onClearAll={clearAll}
              onFilterChange={setFilter}
              onSoundToggle={() => setSoundOn((p) => !p)}
              onClickItem={goToLead}
              onViewAll={() => {
                setOpen(false);
                navigate(
                  isAdmin ? "/admin/all-leads" : "/admin/leads-pipeline",
                );
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NotificationBell;
