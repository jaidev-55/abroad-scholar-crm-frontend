// ─── Audio — module-level singleton ──────────────────────────────────────────

const audioCtxRef: { current: AudioContext | null } = { current: null };

export const unlockAudio = (): void => {
  if (!audioCtxRef.current) {
    const Ctor =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    audioCtxRef.current = new Ctor();
  }
  if (audioCtxRef.current.state === "suspended") {
    audioCtxRef.current.resume();
  }
};

export const chime = (): void => {
  const ctx = audioCtxRef.current;
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    const t = ctx.currentTime + i * 0.13;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.start(t);
    osc.stop(t + 0.55);
  });
};
