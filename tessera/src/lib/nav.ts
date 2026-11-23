import { lenisHolder, EASE_ARRAY } from "./motion";

/** Smooth scroll to a section through Lenis, falling back to native scrolling. */
export function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = lenisHolder.current;
  if (lenis) {
    lenis.scrollTo(el, {
      duration: 1.8,
      easing: (t: number) => {
        // expo-style ease out, close to cubic-bezier(0.16, 1, 0.3, 1)
        void EASE_ARRAY;
        return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
      },
    });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function goTop() {
  const lenis = lenisHolder.current;
  if (lenis) lenis.scrollTo(0, { duration: 1.6, easing: (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)) });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
