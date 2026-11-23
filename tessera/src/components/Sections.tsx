import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { Check, FileText, KanbanSquare, Minus, Plus, RefreshCw, Zap } from "lucide-react";
import { gsap, EASE, EASE_ARRAY, prefersReduced } from "../lib/motion";
import { PLANS, type Plan } from "../lib/plans";
import { Button } from "./ui/button";
import { cn } from "../utils/cn";

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, ease: EASE_ARRAY, delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold tracking-[0.2em] text-lime uppercase">{eyebrow}</p>
      <h2 className="font-display text-[clamp(36px,5.5vw,72px)] leading-none font-bold">{title}</h2>
    </div>
  );
}

/* ---------------- Features ---------------- */
export function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-16">
        <Reveal>
          <SectionHead eyebrow="Built from tiles" title="Small parts, one workspace." />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal className="md:col-span-2">
            <article className="flex h-full flex-col justify-between gap-16 rounded-[40px] bg-cobalt p-6 sm:p-8">
              <KanbanSquare size={40} aria-hidden="true" />
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-3xl font-bold">Boards that snap together</h3>
                <p className="max-w-[65ch] text-paper/85">Drag tiles into any layout. Nothing breaks when you rearrange.</p>
              </div>
            </article>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="flex h-full flex-col justify-between gap-16 rounded-[40px] bg-paper-dim p-6 text-ink sm:p-8">
              <FileText size={40} aria-hidden="true" />
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-3xl font-bold">Docs inline</h3>
                <p className="text-ink/75">Write next to the work it describes.</p>
              </div>
            </article>
          </Reveal>
          <Reveal>
            <article className="flex h-full flex-col justify-between gap-16 rounded-[40px] border border-white/10 bg-ink-2 p-6 sm:p-8">
              <Zap size={40} className="text-lime" aria-hidden="true" />
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-3xl font-bold">Rules without code</h3>
                <p className="text-mute">When a card moves, the next step starts itself.</p>
              </div>
            </article>
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.1}>
            <article className="flex h-full flex-col justify-between gap-16 rounded-[40px] bg-ink-3 p-6 sm:p-8">
              <RefreshCw size={40} className="text-cobalt-light" aria-hidden="true" />
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-3xl font-bold">Offline first</h3>
                <p className="max-w-[65ch] text-mute">Edits save on your device and merge when you reconnect.</p>
                <ul className="tnum flex flex-wrap gap-2 text-sm">
                  {["Launch board  synced 2s ago", "Roadmap doc  synced 14s ago", "Hiring  3 edits queued"].map((t) => (
                    <li key={t} className="rounded-full bg-ink px-4 py-2 text-mute">
                      {t.replace("  ", ", ")}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Stats ---------------- */
function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const fmt = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (prefersReduced()) {
      el.textContent = fmt(to);
      return;
    }
    const o = { v: 0 };
    const tween = gsap.to(o, { v: to, duration: 2.4, ease: EASE, onUpdate: () => (el.textContent = fmt(o.v)) });
    return () => void tween.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return (
    <span ref={ref} className="tnum">
      {fmt(0)}
    </span>
  );
}

export function Stats() {
  const stats = [
    { to: 12400, d: 0, s: "", label: "teams plan with Tessera" },
    { to: 99.98, d: 2, s: "%", label: "uptime over the last year" },
    { to: 38, d: 0, s: " ms", label: "median time to sync an edit" },
  ];
  return (
    <section aria-label="Tessera in numbers" className="border-y border-white/10 px-6 py-24">
      <dl className="mx-auto grid w-full max-w-[1120px] gap-16 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-2">
            <dd className="font-display text-[clamp(48px,6vw,80px)] leading-none font-bold">
              <CountUp to={s.to} decimals={s.d} suffix={s.s} />
            </dd>
            <dt className="text-mute">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------------- Pricing ---------------- */
export function Pricing({ onChoose }: { onChoose: (p: Plan) => void }) {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-16">
        <Reveal>
          <SectionHead eyebrow="Pricing" title="Pick a plan, pay in one tap." />
        </Reveal>
        <div className="grid items-stretch gap-4 md:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} className="h-full">
              <article
                className={cn(
                  "flex h-full flex-col justify-between gap-8 rounded-[40px] p-6 sm:p-8",
                  p.id === "team" && "bg-cobalt text-paper",
                  p.id === "solo" && "border border-white/10 bg-ink-2",
                  p.id === "scale" && "bg-ink-3",
                )}
              >
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-3xl font-bold">{p.name}</h3>
                    <p className={p.featured ? "text-paper/85" : "text-mute"}>{p.blurb}</p>
                  </div>
                  <p className="flex items-end gap-2">
                    <span className="font-display tnum text-6xl leading-none font-bold">${p.price}</span>
                    <span className={cn("pb-1 text-sm", p.featured ? "text-paper/80" : "text-mute")}>
                      {p.price ? "per seat, per month" : "free forever"}
                    </span>
                  </p>
                  <ul className="flex flex-col gap-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check size={16} className={p.featured ? "text-lime" : "text-cobalt-light"} aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant={p.featured ? "primary" : "secondary"} size="lg" onClick={() => onChoose(p)} className="w-full">
                  {p.cta}
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
const FAQS = [
  ["Can I try Tessera before I pay?", "Yes. Team starts with 14 free days and nothing is charged until the trial ends. You can cancel from settings in two clicks."],
  ["What happens to my data if I downgrade?", "Nothing is deleted. Boards above the free limit become read only, and you can reopen them by upgrading again."],
  ["Does Tessera work offline?", "Yes. Edits are stored on your device and merge when you reconnect, with conflicts shown side by side."],
  ["How do I pay?", "Apple Pay and Google Pay are one tap. You can also use a card, and your receipt goes to the email you signed in with."],
  ["Is Tessera a real product?", "No. Tessera is a fictional company created for this design demo, so no payment is ever taken."],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto flex w-full max-w-[880px] flex-col gap-16">
        <Reveal>
          <SectionHead eyebrow="FAQ" title="Questions, answered." />
        </Reveal>
        <div className="flex flex-col gap-2">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <Reveal key={q}>
                <div className={cn("rounded-[32px] p-2 transition-colors duration-500", isOpen ? "bg-ink-3" : "bg-ink-2")}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex min-h-14 w-full items-center justify-between gap-4 rounded-3xl px-4 py-2 text-left text-lg font-medium transition-colors duration-500 hover:bg-white/5 focus-visible:outline-2"
                    >
                      {q}
                      <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors duration-500", isOpen ? "bg-lime text-ink" : "bg-ink text-paper")}>
                        {isOpen ? <Minus size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                      </span>
                    </button>
                  </h3>
                  <div id={`faq-${i}`} role="region" data-open={isOpen} className="disclose" aria-hidden={!isOpen}>
                    <div className="overflow-hidden">
                      <p className="max-w-[65ch] px-4 pt-2 pb-4 text-mute">{a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
