import { useEffect, useRef, type ReactNode } from "react";
import { gsap, EASE, prefersReduced } from "../lib/motion";
import { cn } from "../utils/cn";

/**
 * Magnetic pull: inside a radius (30 to 50px) around the element, the target warps toward
 * the cursor vector, then snaps back fluidly when the cursor leaves.
 */
export function Magnetic({
  children,
  radius = 40,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  radius?: number;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: EASE });
    const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: EASE });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const curX = Number(gsap.getProperty(el, "x"));
      const curY = Number(gsap.getProperty(el, "y"));
      const left = r.left - curX;
      const top = r.top - curY;
      const cx = left + r.width / 2;
      const cy = top + r.height / 2;
      const inside =
        e.clientX > left - radius &&
        e.clientX < left + r.width + radius &&
        e.clientY > top - radius &&
        e.clientY < top + r.height + radius;
      if (inside) {
        xTo((e.clientX - cx) * strength);
        yTo((e.clientY - cy) * strength);
      } else {
        xTo(0);
        yTo(0);
      }
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [radius, strength]);

  return (
    <div ref={ref} className={cn("inline-block", className)}>
      {children}
    </div>
  );
}
