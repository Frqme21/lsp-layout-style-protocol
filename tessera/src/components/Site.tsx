import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { ArrowRight, ArrowUp } from "lucide-react";
import { gsap, ScrollTrigger, EASE, lenisHolder, scrollState } from "../lib/motion";
import { goTo, goTop } from "../lib/nav";
import { PLANS, type Plan } from "../lib/plans";
import { Button } from "./ui/button";
import { Magnetic } from "./Magnetic";
import { Logo } from "./Logo";
import Story from "./Story";
import { Features, Stats, Pricing, Faq } from "./Sections";
import Checkout from "./Checkout";

const LINKS = [
  ["Product", "product"],
  ["Pricing", "pricing"],
  ["FAQ", "faq"],
] as const;

const CUSTOMERS = ["Northwind", "Halcyon", "Brightwell", "Okapi Labs", "Fernhill", "Lumen Works", "Parcel", "Mosaic & Co"];

function Nav({ email }: { email: string }) {
  const brand = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-letter", { yPercent: 120, duration: 0.9, ease: EASE, stagger: 0.05, delay: 0.9 });
    }, brand);
    return () => ctx.revert();
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        aria-label="Primary"
        className="flex w-full max-w-[960px] items-center justify-between gap-4 rounded-full border border-white/10 bg-ink/70 p-2 backdrop-blur-xl"
      >
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new Event("logo:pulse"));
            goTop();
          }}
          aria-label="Tessera, back to top"
          className="flex min-h-12 items-center gap-2 rounded-full pr-4 transition-colors duration-500 hover:bg-white/5 focus-visible:outline-2"
        >
          <span id="nav-logo" aria-hidden="true" className="block h-12 w-12" />
          <span ref={brand} className="font-display flex text-xl font-bold" aria-hidden="true">
            {"Tessera".split("").map((c, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 leading-none">
                <span className="nav-letter inline-block">{c}</span>
              </span>
            ))}
          </span>
        </button>

        <div className="hidden items-center gap-2 md:flex">
          {LINKS.map(([label, id]) => (
            <Button key={id} variant="ghost" onClick={() => goTo(id)}>
              {label}
            </Button>
          ))}
        </div>

        <div
          title={`Signed in as ${email}`}
          className="flex min-h-12 items-center gap-2 rounded-full bg-ink-3 py-2 pr-4 pl-2 text-sm text-paper"
        >
          <span className="font-display grid h-8 w-8 place-items-center rounded-full bg-cobalt text-sm font-bold">
            {email.charAt(0).toUpperCase()}
          </span>
          <span className="hidden max-w-[160px] truncate sm:block">{email}</span>
        </div>
      </nav>
    </header>
  );
}

const DECOR = [
  { pos: "top-[20%] left-[7%]", size: "clamp(56px,9vw,128px)", depth: 1.1, shape: "rounded-tl-[100%] bg-paper" },
  { pos: "top-[26%] right-[9%]", size: "clamp(48px,7vw,104px)", depth: 0.7, shape: "rounded-full bg-lime" },
  { pos: "bottom-[22%] left-[12%]", size: "clamp(48px,7vw,96px)", depth: 1.4, shape: "rounded-lg bg-cobalt-light" },
  { pos: "bottom-[20%] right-[7%]", size: "clamp(64px,10vw,144px)", depth: 0.9, shape: "rounded-br-[100%] bg-paper-dim" },
  { pos: "top-[56%] left-[3%]", size: "clamp(24px,3vw,40px)", depth: 0.5, shape: "rounded-full bg-ink-3" },
  { pos: "top-[14%] right-[28%]", size: "clamp(24px,3vw,40px)", depth: 0.6, shape: "rounded-md bg-cobalt-deep" },
];

function Hero({ onStart }: { onStart: () => void }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    let mm: gsap.MatchMedia | undefined;
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", { y: 56, autoAlpha: 0, duration: 1.3, ease: EASE, stagger: 0.12, delay: 0.5 });
      gsap.from(".hero-fade", { autoAlpha: 0, duration: 1, ease: EASE, delay: 0.9 });
      mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const decor = gsap.utils.toArray<HTMLElement>(".decor");
        const inner = gsap.utils.toArray<HTMLElement>(".decor-inner");
        // scroll depth
        decor.forEach((el) => {
          gsap.to(el, {
            y: () => -Number(el.dataset.depth) * 180,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          });
        });
        // cursor depth
        const movers = inner.map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 1.2, ease: EASE }),
          y: gsap.quickTo(el, "y", { duration: 1.2, ease: EASE }),
          d: Number(el.dataset.depth),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * m.d * 64);
            m.y(ny * m.d * 64);
          });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        // scroll-velocity skew
        const skew = gsap.quickSetter(".decor-wrap", "skewY", "deg");
        const tick = () => skew(gsap.utils.clamp(-8, 8, scrollState.velocity * 0.15));
        gsap.ticker.add(tick);
        return () => {
          window.removeEventListener("pointermove", onMove);
          gsap.ticker.remove(tick);
        };
      });
    }, root);
    return () => {
      mm?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      id="top"
      className="dot-grid relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6 pt-32 pb-24 text-center"
    >
      <div aria-hidden="true" className="decor-wrap pointer-events-none absolute inset-0">
        {DECOR.map((d, i) => (
          <div key={i} className={`decor absolute ${d.pos}`} data-depth={d.depth}>
            <div className={`decor-inner ${d.shape}`} data-depth={d.depth} style={{ width: d.size, height: d.size }} />
          </div>
        ))}
      </div>
      <h1 className="hero-line font-display relative text-[clamp(56px,9vw,112px)] leading-[0.95] font-bold">Work in tiles.</h1>
      <p className="hero-line relative max-w-[65ch] text-[clamp(16px,2vw,20px)] text-mute">
        Modular workspace for small teams.
      </p>
      <div className="hero-fade relative">
        <Magnetic radius={48}>
          <Button id="hero-cta" size="lg" onClick={onStart}>
            Start free trial
            <ArrowRight size={20} aria-hidden="true" />
          </Button>
        </Magnetic>
      </div>
    </section>
  );
}

/** Marquee whose speed and skew follow instantaneous scroll velocity. */
function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let pos = 0;
      const setX = gsap.quickSetter(track.current, "xPercent");
      const setSkew = gsap.quickSetter(track.current, "skewX", "deg");
      const tick = () => {
        const v = scrollState.velocity;
        pos -= 0.03 + Math.min(Math.abs(v), 60) * 0.004;
        if (pos <= -50) pos += 50;
        setX(pos);
        setSkew(gsap.utils.clamp(-10, 10, -v * 0.2));
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    });
    return () => mm.revert();
  }, []);
  const items = (hidden: boolean) =>
    CUSTOMERS.map((c, i) => (
      <span key={`${c}-${hidden}`} aria-hidden={hidden || undefined} className="flex items-center gap-8">
        <span className="font-display text-[clamp(32px,5vw,64px)] font-bold whitespace-nowrap text-paper/80">{c}</span>
        <span className={`h-4 w-4 shrink-0 ${["bg-lime rounded-full", "bg-cobalt-light", "bg-paper-dim rounded-tl-full", "bg-cobalt rounded-br-full"][i % 4]}`} />
      </span>
    ));
  return (
    <section aria-label="Teams that use Tessera" className="overflow-hidden border-y border-white/10 py-16">
      <div ref={track} className="gpu flex w-max items-center gap-8">
        <div className="flex items-center gap-8">{items(false)}</div>
        <div className="flex items-center gap-8">{items(true)}</div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col gap-16 border-t border-white/10 px-6 py-16">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <Logo size={64} />
            <span className="font-display text-[clamp(40px,7vw,80px)] leading-none font-bold">Tessera</span>
          </div>
          <Button variant="secondary" onClick={goTop}>
            <ArrowUp size={18} aria-hidden="true" />
            Back to top
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-mute">
          <p>Tessera Labs is a fictional company made for this demo.</p>
          <div className="flex flex-wrap gap-2">
            {LINKS.map(([label, id]) => (
              <Button key={id} variant="ghost" onClick={() => goTo(id)}>
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Site({ email }: { email: string }) {
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ lerp: 0.1 });
      lenisHolder.current = lenis;
      lenis.on("scroll", (l: Lenis) => {
        scrollState.velocity = l.velocity;
        ScrollTrigger.update();
      });
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        lenisHolder.current = null;
        scrollState.velocity = 0;
      };
    });
    return () => mm.revert();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("locked", plan !== null);
    if (plan) lenisHolder.current?.stop();
    else lenisHolder.current?.start();
    return () => {
      document.documentElement.classList.remove("locked");
    };
  }, [plan]);

  const team = PLANS[1];

  return (
    <div className="overflow-x-clip bg-ink">
      <Nav email={email} />
      <main>
        <Hero onStart={() => setPlan(team)} />
        <Marquee />
        <Story />
        <Features />
        <Stats />
        <Pricing onChoose={setPlan} />
        <Faq />
      </main>
      <Footer />
      <Checkout plan={plan} email={email} onClose={() => setPlan(null)} />
    </div>
  );
}
