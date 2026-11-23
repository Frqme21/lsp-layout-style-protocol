import { useEffect, useRef, useState } from "react";
import { gsap, EASE, prefersReduced } from "../lib/motion";

/**
 * Holds the viewport with a percentage counter until fonts are ready.
 * Page text already exists in the DOM beneath, so LCP is not blocked by decoration.
 */
export default function Preloader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const state = { v: 0 };
    const reduced = prefersReduced();
    let fontsReady = false;
    let cancelled = false;
    const fontsPromise = Promise.all([
      document.fonts.load('700 1em "Bricolage Grotesque Variable"'),
      document.fonts.load('400 1em "Inter Variable"'),
    ]).catch(() => undefined);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      const climb = gsap.to(state, {
        v: 88,
        duration: reduced ? 0.2 : 1.4,
        ease: "power2.out",
        onUpdate: () => setPct(Math.round(state.v)),
      });
      tl.add(climb);
      const finish = () => {
        if (cancelled) return;
        gsap
          .timeline()
          .to(state, {
            v: 100,
            duration: reduced ? 0.1 : 0.5,
            ease: EASE,
            onUpdate: () => setPct(Math.round(state.v)),
          })
          .to(".pre-copy", { autoAlpha: 0, y: -24, duration: 0.5, ease: EASE }, "+=0.15")
          .to(root.current, { yPercent: -100, duration: reduced ? 0.1 : 1, ease: EASE }, "<0.1")
          .call(onReveal, [], "<0.4")
          .call(onDone);
      };
      fontsPromise.then(() => {
        fontsReady = true;
        if (climb.isActive()) climb.eventCallback("onComplete", finish);
        else finish();
      });
      void fontsReady;
    }, root);
    return () => {
      cancelled = true;
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-6 sm:p-8"
    >
      <p className="pre-copy text-sm font-medium tracking-[0.2em] text-mute uppercase">Tessera</p>
      <div className="pre-copy flex items-end justify-between gap-4">
        <span className="font-display tnum text-[clamp(88px,22vw,288px)] leading-[0.8] font-bold text-paper">
          {pct}
        </span>
        <span className="pb-2 text-sm tracking-[0.2em] text-mute uppercase">Laying tiles</span>
      </div>
    </div>
  );
}
