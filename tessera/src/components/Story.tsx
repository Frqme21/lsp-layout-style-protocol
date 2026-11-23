import { useEffect, useRef } from "react";
import { BarChart3, Calendar, FileText, KanbanSquare, Lock, Search, Users, Zap, type LucideIcon } from "lucide-react";
import { gsap, EASE } from "../lib/motion";

const OUTER: { label: string; Icon: LucideIcon; cls: string }[] = [
  { label: "Boards", Icon: KanbanSquare, cls: "bg-ink-3 text-paper" },
  { label: "Docs", Icon: FileText, cls: "bg-paper-dim text-ink" },
  { label: "Rules", Icon: Zap, cls: "bg-cobalt-deep text-paper" },
  { label: "People", Icon: Users, cls: "bg-ink-2 border border-white/10 text-paper" },
  { label: "Calendar", Icon: Calendar, cls: "bg-cobalt text-paper" },
  { label: "Reports", Icon: BarChart3, cls: "bg-ink-2 border border-white/10 text-paper" },
  { label: "Vault", Icon: Lock, cls: "bg-ink-3 text-paper" },
  { label: "Search", Icon: Search, cls: "bg-paper-dim text-ink" },
];
// direction each outer tile drifts toward as the centre tile takes over
const DIRS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

function ProductMock() {
  const cols = [
    { title: "Plan", cards: [["Brand refresh", "bg-paper-dim text-ink"], ["Pricing page", "bg-ink-3 text-paper"]] },
    { title: "Build", cards: [["Onboarding flow", "bg-cobalt-light text-ink"], ["Sync engine", "bg-ink-3 text-paper"], ["Rules editor", "bg-paper-dim text-ink"]] },
    { title: "Ship", cards: [["Launch notes", "bg-ink-3 text-paper"]] },
  ];
  return (
    <div className="w-[min(880px,88vw)] rounded-[32px] border border-white/10 bg-ink p-4 shadow-[0_32px_96px_oklch(0.1_0.012_265/0.6)]">
      <div className="flex items-center gap-2 px-2 pb-4">
        <span className="h-3 w-3 rounded-full bg-paper-dim" />
        <span className="h-3 w-3 rounded-full bg-cobalt-light" />
        <span className="h-3 w-3 rounded-full bg-lime" />
        <span className="ml-4 text-xs text-mute">Launch board</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {cols.map((c, i) => (
          <div key={c.title} className={`flex flex-col gap-2 rounded-2xl bg-ink-2 p-2 ${i === 2 ? "hidden sm:flex" : ""}`}>
            <p className="px-2 py-2 text-xs font-semibold tracking-widest text-mute uppercase">{c.title}</p>
            {c.cards.map(([t, cls]) => (
              <div key={t} className={`rounded-lg p-4 text-sm font-medium ${cls}`}>
                {t}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Story() {
  const root = useRef<HTMLElement>(null);
  const cell = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const ui = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const section = root.current!;
      const outer = gsap.utils.toArray<HTMLElement>(".story-tile", section);
      const insetFrom = () => {
        if (!section || !cell.current) return "inset(0px 0px 0px 0px round 32px)";
        const s = section.getBoundingClientRect();
        const c = cell.current.getBoundingClientRect();
        const l = c.left - s.left;
        const t = c.top - s.top;
        const r = s.right - c.right;
        const b = s.bottom - c.bottom;
        return `inset(${t}px ${r}px ${b}px ${l}px round 32px)`;
      };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=170%",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(clip.current, { clipPath: insetFrom }, { clipPath: "inset(0px 0px 0px 0px round 0px)", duration: 1, ease: EASE }, 0)
        .to(
          outer,
          {
            x: (i: number) => DIRS[i][0] * window.innerWidth * 0.45,
            y: (i: number) => DIRS[i][1] * window.innerHeight * 0.45,
            scale: 1.25,
            autoAlpha: 0,
            duration: 1,
            ease: EASE,
          },
          0,
        )
        .fromTo(ui.current, { scale: 0.45 }, { scale: 1, duration: 1, ease: EASE }, 0)
        .fromTo(copy.current, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE }, 0.6)
        // foreground layers sweep over the product at different speeds
        .fromTo(".story-fg-a", { yPercent: 140, rotation: 0 }, { yPercent: -260, rotation: 90, duration: 1.7, ease: EASE }, 0)
        .fromTo(".story-fg-b", { yPercent: 160, rotation: 0 }, { yPercent: -220, rotation: -60, duration: 1.5, ease: EASE }, 0.2);
    });
    // static fallback for reduced motion: the product is simply shown full size
    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (clip.current) gsap.set(clip.current, { clipPath: "inset(0px 0px 0px 0px round 0px)" });
      gsap.set(".story-tile", { autoAlpha: 0 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="product" aria-label="Product overview" className="relative h-screen overflow-hidden bg-ink">
      {/* background layer: a 3 by 3 mosaic, the centre cell becomes the product */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-2 sm:gap-4 sm:p-4">
        {[0, 1, 2, 3].map((n) => (
          <Tile key={n} {...OUTER[n]} />
        ))}
        <div ref={cell} aria-hidden="true" />
        {[4, 5, 6, 7].map((n) => (
          <Tile key={n} {...OUTER[n]} />
        ))}
      </div>

      {/* middle layer: product revealed by an expanding mask */}
      <div ref={clip} className="gpu absolute inset-0 bg-cobalt" style={{ clipPath: "inset(33% 33% 33% 33% round 32px)" }}>
        <div className="flex h-full flex-col items-center justify-center gap-8 px-4">
          <div ref={copy} className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-display text-[clamp(32px,5vw,64px)] leading-none font-bold">Every page is a tile.</h2>
            <p className="max-w-[65ch] text-[clamp(16px,1.6vw,18px)] text-paper/85">Snap boards, docs and rules into any layout.</p>
          </div>
          <div ref={ui} className="gpu">
            <ProductMock />
          </div>
        </div>
      </div>

      {/* foreground layer: shapes pass in front of the product */}
      <div aria-hidden="true" className="story-fg-a pointer-events-none absolute -right-8 bottom-0 z-10 h-[clamp(120px,22vw,320px)] w-[clamp(120px,22vw,320px)] rounded-full bg-lime" />
      <div aria-hidden="true" className="story-fg-b pointer-events-none absolute bottom-0 left-[8%] z-10 h-[clamp(96px,16vw,240px)] w-[clamp(96px,16vw,240px)] rounded-tl-[100%] bg-paper-dim" />
    </section>
  );
}

function Tile({ label, Icon, cls }: { label: string; Icon: LucideIcon; cls: string }) {
  return (
    <div className={`story-tile gpu flex flex-col items-center justify-center gap-2 rounded-[24px] sm:rounded-[32px] ${cls}`}>
      <Icon size={32} aria-hidden="true" />
      <span className="font-display text-sm font-semibold sm:text-lg">{label}</span>
    </div>
  );
}
