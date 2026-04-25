import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { RiArrowRightLine, RiCloseLine } from "react-icons/ri";
import { TYPE_CFG } from "./constants";
import type { Notif } from "./types";

// ─── Toast Card ───────────────────────────────────────────────────────────────

interface ToastCardProps {
  n: Notif;
  bellRect: DOMRect | null;
  onDismiss: () => void;
  onClick: () => void;
}

const ToastCard: React.FC<ToastCardProps> = ({
  n,
  bellRect,
  onDismiss,
  onClick,
}) => {
  const cfg = TYPE_CFG[n.type];
  const Icon = cfg.icon;

  const flyTo = bellRect
    ? {
        x: bellRect.right - window.innerWidth + 20,
        y: -(window.innerHeight - bellRect.bottom - 20),
        scale: 0.08,
        opacity: 0,
      }
    : { x: 80, scale: 0.5, opacity: 0 };

  useEffect(() => {
    const t = setTimeout(onDismiss, 5200);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.88 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={flyTo}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className={`relative w-[320px] bg-white rounded-2xl border ${cfg.border} overflow-hidden cursor-pointer select-none`}
      style={{
        boxShadow: `0 4px 24px ${cfg.bar}25, 0 1px 6px rgba(0,0,0,0.07)`,
      }}
      onClick={onClick}
    >
      <div className="h-0.5 w-full" style={{ background: cfg.bar }} />

      <motion.div
        className="absolute bottom-0 left-0 h-[2px] opacity-40"
        style={{ background: cfg.bar }}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 5.2, ease: "linear" }}
      />

      <div className="flex items-start gap-3 p-4">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg} border ${cfg.border}`}
        >
          <Icon size={17} className={cfg.color} />
        </div>

        <div className="flex-1 min-w-0">
          <span
            className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${cfg.color} mb-0.5`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <p className="text-[13px] font-bold text-slate-900 leading-tight">
            {n.title}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
            {n.subtitle}
          </p>
          <span className="inline-flex items-center gap-0.5 mt-1.5 text-[11px] text-blue-600 font-semibold">
            Tap to view <RiArrowRightLine size={11} />
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-300 hover:text-slate-500 border-none bg-transparent cursor-pointer shrink-0"
        >
          <RiCloseLine size={13} />
        </button>
      </div>
    </motion.div>
  );
};

export default ToastCard;
