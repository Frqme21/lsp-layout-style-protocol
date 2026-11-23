import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("lsp", "0.16,1,0.3,1");

export const EASE = "lsp";
export const EASE_ARRAY: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Shared, instantaneous scroll velocity (written by Lenis, read by decorative layers). */
export const scrollState = { velocity: 0 };

/** Holder so nav links and sheets can drive the smooth scroller. */
export const lenisHolder: { current: Lenis | null } = { current: null };

export function debounce<T extends (...args: never[]) => void>(fn: T, ms = 120) {
  let t: ReturnType<typeof setTimeout> | undefined;
  const wrapped = (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
  wrapped.cancel = () => {
    if (t) clearTimeout(t);
  };
  return wrapped;
}

export { gsap, ScrollTrigger };
