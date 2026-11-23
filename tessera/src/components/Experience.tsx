import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Info, Loader2, LogIn } from "lucide-react";
import { gsap, EASE, debounce } from "../lib/motion";
import { LogoTile, TILE_OFFSETS } from "./Logo";
import { Button } from "./ui/button";
import { Magnetic } from "./Magnetic";
import Site from "./Site";
import { cn } from "../utils/cn";

type Stage = "intro" | "login" | "welcome" | "site";
const SIZE = 160;
const BRAND = "TESSERA".split("");

/* ---------- helpers: inline guidance instead of generic errors ---------- */
const TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.co": "gmail.com",
  "hotmial.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "yahooo.com": "yahoo.com",
};
type Hint = { kind: "idle" | "warn" | "ok"; text: string; fix?: string };

function emailHint(v: string): Hint {
  const value = v.trim();
  if (!value) return { kind: "idle", text: "Use your work email, like name@company.com." };
  if (!value.includes("@")) return { kind: "warn", text: "Add an @ and a domain, like name@company.com." };
  const [local, domain = ""] = value.split("@");
  if (!local) return { kind: "warn", text: "Add the part before the @, usually your name." };
  if (!domain) return { kind: "warn", text: "Add a domain after the @, such as company.com." };
  if (TYPOS[domain.toLowerCase()])
    return { kind: "warn", text: `Did you mean ${local}@${TYPOS[domain.toLowerCase()]}?`, fix: `${local}@${TYPOS[domain.toLowerCase()]}` };
  if (!/^[^\s@]+\.[^\s@]{2,}$/.test(domain))
    return { kind: "warn", text: "The domain needs an ending like .com or .io." };
  return { kind: "ok", text: "Looks good." };
}
function passwordHint(v: string): Hint {
  if (!v) return { kind: "idle", text: "Any password with 8 or more characters works in this demo." };
  if (v.length < 8) return { kind: "warn", text: `Use 8 or more characters. You have ${v.length}.` };
  return { kind: "ok", text: "Long enough." };
}
function niceName(email: string) {
  const first = email.split("@")[0].split(/[._-]/)[0] || "there";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function HintLine({ hint, onFix }: { hint: Hint; onFix?: () => void }) {
  const Icon = hint.kind === "ok" ? CheckCircle2 : hint.kind === "warn" ? AlertCircle : Info;
  return (
    <p
      aria-live="polite"
      className={cn(
        "flex min-h-6 items-start gap-2 text-[13px] leading-6 transition-colors duration-500",
        hint.kind === "warn" && "text-danger",
        hint.kind === "ok" && "text-lime",
        hint.kind === "idle" && "text-mute",
      )}
    >
      <Icon size={16} className="mt-1 shrink-0" aria-hidden="true" />
      <span>
        {hint.text}
        {hint.fix && onFix && (
          <button
            type="button"
            onClick={onFix}
            className="ml-2 inline-flex min-h-6 rounded-full underline underline-offset-4 hover:text-paper focus-visible:outline-2"
          >
            Use it
          </button>
        )}
      </span>
    </p>
  );
}

export default function Experience({ ready }: { ready: boolean }) {
  const [stage, setStage] = useState<Stage>("intro");
  const stageRef = useRef<Stage>("intro");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const logo = useRef<HTMLDivElement>(null);
  const tiles = useRef<(SVGSVGElement | null)[]>([]);
  const wordmark = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const loginCard = useRef<HTMLFormElement>(null);
  const welcomeCard = useRef<HTMLDivElement>(null);
  const enterBtn = useRef<HTMLButtonElement>(null);
  const wiper = useRef<HTMLDivElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const passInput = useRef<HTMLInputElement>(null);
  const ctx = useRef<gsap.Context | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const setStageBoth = (s: Stage) => {
    stageRef.current = s;
    setStage(s);
  };

  /* ----- where the logo lives in each state ----- */
  const spotFor = useCallback((s: Stage) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (s === "intro") return { x: w / 2, y: h / 2 - 48, s: 1 };
    if (s === "login") return { x: w / 2, y: h < 720 ? 48 : 72, s: 0.35 };
    if (s === "welcome") {
      const top = welcomeCard.current?.offsetTop ?? h / 2 - 120;
      return { x: w / 2, y: Math.max(56, top - 48), s: 0.45 };
    }
    const a = document.getElementById("nav-logo");
    const r = a?.getBoundingClientRect();
    return r
      ? { x: r.left + r.width / 2, y: r.top + r.height / 2, s: 40 / SIZE }
      : { x: 64, y: 40, s: 40 / SIZE };
  }, []);
  const toProps = (p: { x: number; y: number; s: number }) => ({ x: p.x - SIZE / 2, y: p.y - SIZE / 2, scale: p.s });
  const wordmarkY = () => (window.innerHeight < 720 ? 48 : 72) + 36;

  /* ----- initial hidden states ----- */
  useLayoutEffect(() => {
    ctx.current = gsap.context(() => {
      gsap.set([loginCard.current, welcomeCard.current, wordmark.current, wiper.current, intro.current], { autoAlpha: 0 });
      gsap.set(logo.current, { ...toProps(spotFor("intro")), autoAlpha: 0 });
      gsap.set(wordmark.current, { y: wordmarkY() });
    });
    return () => {
      tl.current?.kill();
      ctx.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----- scroll lock until the site opens ----- */
  useEffect(() => {
    document.documentElement.classList.toggle("locked", stage !== "site");
    return () => document.documentElement.classList.remove("locked");
  }, [stage]);

  /* ----- intro: tiles assemble ----- */
  useEffect(() => {
    if (!ready) return;
    ctx.current?.add(() => {
      const dirs = [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ];
      gsap.set(logo.current, { autoAlpha: 1 });
      gsap
        .timeline()
        .fromTo(
          tiles.current,
          {
            x: (i: number) => dirs[i][0] * 220,
            y: (i: number) => dirs[i][1] * 220,
            rotation: (i: number) => (i % 2 ? 140 : -140),
            scale: 0,
          },
          { x: 0, y: 0, rotation: 0, scale: 1, duration: 1.5, ease: EASE, stagger: 0.1 },
        )
        .fromTo(intro.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, ease: EASE }, 0.9);
    });
  }, [ready]);

  /* ----- resize: debounced re-seat of the logo for the current stage ----- */
  useEffect(() => {
    const onResize = debounce(() => {
      if (tl.current?.isActive()) return;
      const s = stageRef.current;
      gsap.set(logo.current, toProps(spotFor(s)));
      gsap.set(wordmark.current, { y: wordmarkY() });
    }, 120);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      onResize.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----- logo pulse (nav logo click) ----- */
  useEffect(() => {
    const pulse = () =>
      ctx.current?.add(() => {
        gsap.to(tiles.current, { rotation: "+=360", duration: 1.2, ease: EASE, stagger: 0.07, overwrite: "auto" });
      });
    window.addEventListener("logo:pulse", pulse);
    return () => window.removeEventListener("logo:pulse", pulse);
  }, []);

  /* ================= sequences ================= */
  const run = (fn: () => gsap.core.Timeline) => {
    tl.current?.kill();
    ctx.current?.add(() => {
      tl.current = fn();
    });
  };

  const toLogin = () => {
    setStageBoth("login");
    run(() => {
      const letters = wordmark.current!.querySelectorAll(".wm-letter");
      return gsap
        .timeline()
        .to(intro.current, { autoAlpha: 0, y: 16, duration: 0.5, ease: EASE })
        .to(logo.current, { ...toProps(spotFor("login")), duration: 1.2, ease: EASE }, 0)
        .set(wordmark.current, { autoAlpha: 1 }, 0.5)
        .fromTo(letters, { yPercent: 120 }, { yPercent: 0, duration: 0.8, ease: EASE, stagger: 0.06 }, 0.55)
        .fromTo(loginCard.current, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1, ease: EASE }, 0.75)
        .call(() => emailInput.current?.focus({ preventScroll: true }));
    });
  };

  const toIntro = () => {
    setStageBoth("intro");
    run(() => {
      const letters = wordmark.current!.querySelectorAll(".wm-letter");
      return gsap
        .timeline()
        .to(loginCard.current, { autoAlpha: 0, y: 24, duration: 0.5, ease: EASE })
        .to(letters, { yPercent: -120, duration: 0.5, ease: EASE, stagger: 0.03 }, 0)
        .set(wordmark.current, { autoAlpha: 0 })
        .to(logo.current, { ...toProps(spotFor("intro")), duration: 1.1, ease: EASE }, 0.1)
        .fromTo(intro.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE }, 0.6);
    });
  };

  const toWelcome = () => {
    run(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const inset = w < 640 ? 40 : 72;
      const corners = [
        [inset, inset],
        [w - inset, inset],
        [inset, h - inset],
        [w - inset, h - inset],
      ];
      const rots = [-60, 60, 60, -60];
      const center = { x: w / 2, y: h / 2, s: 1 };
      return gsap
        .timeline()
        .to(loginCard.current, { autoAlpha: 0, y: -24, duration: 0.5, ease: EASE })
        .to(wordmark.current, { autoAlpha: 0, duration: 0.4, ease: EASE }, 0)
        .to(logo.current, { ...toProps(center), duration: 1, ease: EASE }, 0.1)
        // split into four tiles that fly to the corners
        .to(
          tiles.current,
          {
            x: (i: number) => corners[i][0] - center.x - TILE_OFFSETS[i].x,
            y: (i: number) => corners[i][1] - center.y - TILE_OFFSETS[i].y,
            rotation: (i: number) => rots[i],
            scale: 1.15,
            duration: 1.1,
            ease: EASE,
            stagger: 0.05,
          },
          1.0,
        )
        .call(() => setStageBoth("welcome"), [], 1.4)
        .fromTo(welcomeCard.current, { autoAlpha: 0, scale: 0.92, y: 24 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: EASE }, 1.45)
        // reassemble above the card
        .to(
          tiles.current,
          { x: 0, y: 0, rotation: 0, scale: 1, duration: 1.1, ease: EASE, stagger: 0.06 },
          2.9,
        )
        .to(logo.current, { x: () => toProps(spotFor("welcome")).x, y: () => toProps(spotFor("welcome")).y, scale: 0.45, duration: 1.1, ease: EASE }, 2.9)
        .call(() => enterBtn.current?.focus({ preventScroll: true }));
    });
  };

  const enter = () => {
    const b = enterBtn.current!.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const R = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy));
    const S = ((R * 2) / 100) * 1.08;
    run(() => {
      gsap.set(wiper.current, { x: cx - 50, y: cy - 50, scale: b.height / 100, autoAlpha: 1 });
      return gsap
        .timeline()
        .to(wiper.current, { scale: S, duration: 1.1, ease: EASE })
        .set([welcomeCard.current, intro.current], { autoAlpha: 0 })
        .call(() => {
          flushSync(() => setStageBoth("site"));
          requestAnimationFrame(reveal);
        });
    });
  };

  /** The wiper settles back down onto the hero call to action on the new page. */
  const reveal = () => {
    ctx.current?.add(() => {
      const sp = spotFor("site");
      gsap.set(logo.current, { ...toProps(sp), autoAlpha: 1 });
      gsap.set(tiles.current, { x: 0, y: 0, rotation: -120, scale: 0 });
      const t = document.getElementById("hero-cta")?.getBoundingClientRect();
      const tx = t ? t.left + t.width / 2 : window.innerWidth / 2;
      const ty = t ? t.top + t.height / 2 : window.innerHeight / 2;
      tl.current = gsap
        .timeline()
        .to(wiper.current, { x: tx - 50, y: ty - 50, scale: (t?.height ?? 56) / 100, duration: 1.2, ease: EASE })
        .to(tiles.current, { scale: 1, rotation: 0, duration: 1.2, ease: EASE, stagger: 0.08 }, 0.3)
        .to(wiper.current, { autoAlpha: 0, duration: 0.3, ease: EASE }, "-=0.25");
    });
  };

  /* ================= form ================= */
  const eHint = emailHint(email);
  const pHint = passwordHint(password);
  const showE = touched.email || email.length > 0;
  const showP = touched.password || password.length > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setTouched({ email: true, password: true });
    if (eHint.kind !== "ok") return emailInput.current?.focus();
    if (pHint.kind !== "ok") return passInput.current?.focus();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toWelcome();
    }, 700);
  };

  const gateVisible = stage !== "site";

  return (
    <>
      {/* kinetic logo: one element that travels through every state */}
      <div
        ref={logo}
        aria-hidden="true"
        className="gpu pointer-events-none fixed top-0 left-0 z-[70]"
        style={{ width: SIZE, height: SIZE }}
      >
        {[0, 1, 2, 3].map((i) => (
          <LogoTile key={i} i={i} ref={(el) => void (tiles.current[i] = el)} />
        ))}
      </div>

      {/* full-screen wiper: grows out of the pressed button, settles on the next page */}
      <div
        ref={wiper}
        aria-hidden="true"
        className="gpu pointer-events-none fixed top-0 left-0 z-[80] rounded-full bg-lime"
        style={{ width: 100, height: 100 }}
      />

      {gateVisible && (
        <div className="dot-grid fixed inset-0 z-10 overflow-hidden bg-ink">
          <h1 className="sr-only">Tessera, sign in</h1>

          {/* wordmark types in letter by letter */}
          <div ref={wordmark} aria-hidden="true" className="gpu pointer-events-none fixed top-0 left-0 z-[65] flex w-full justify-center">
            <p className="font-display flex text-xl font-bold tracking-[0.4em] text-paper">
              {BRAND.map((c, i) => (
                <span key={i} className="inline-block overflow-hidden pb-1 leading-none">
                  <span className="wm-letter inline-block">{c}</span>
                </span>
              ))}
            </p>
          </div>

          {/* step 1: logo above a single sign-in button */}
          <div className="pointer-events-none fixed inset-x-0 top-[calc(50%+64px)] flex justify-center">
            <div ref={intro} aria-hidden={stage !== "intro"} inert={stage !== "intro"} className="pointer-events-auto">
              <Magnetic radius={48}>
                <Button size="lg" onClick={toLogin} className="min-w-56">
                  <LogIn size={20} aria-hidden="true" />
                  Sign in
                </Button>
              </Magnetic>
            </div>
          </div>

          {/* steps 2 and 3 share the optical centre */}
          <div className="pointer-events-none fixed inset-0 grid place-items-center px-4 pt-[clamp(96px,16vh,144px)] pb-8">
            <form
              ref={loginCard}
              noValidate
              onSubmit={submit}
              aria-hidden={stage !== "login"}
              inert={stage !== "login"}
              aria-labelledby="login-title"
              className="pointer-events-auto col-start-1 row-start-1 flex w-full max-w-[440px] flex-col gap-6 rounded-[40px] border border-white/10 bg-ink-2 p-6 sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 id="login-title" className="font-display text-3xl font-bold">
                  Sign in
                </h2>
                <Button type="button" variant="ghost" size="icon" onClick={toIntro} aria-label="Back to start" disabled={loading}>
                  <ArrowLeft size={20} aria-hidden="true" />
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-paper">
                  Work email
                </label>
                <input
                  id="email"
                  ref={emailInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  inputMode="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  aria-invalid={showE && eHint.kind === "warn"}
                  className={cn(
                    "min-h-12 w-full rounded-2xl border bg-ink px-4 text-base text-paper placeholder:text-mute/50 transition-[border-color,box-shadow] duration-500 outline-none focus-visible:border-lime focus-visible:shadow-[0_0_0_4px_oklch(0.93_0.21_120/0.18)]",
                    showE && eHint.kind === "warn" ? "border-danger" : "border-white/12",
                  )}
                />
                <HintLine hint={showE ? eHint : { kind: "idle", text: eHint.text }} onFix={() => eHint.fix && setEmail(eHint.fix)} />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-paper">
                  Password
                </label>
                <input
                  id="password"
                  ref={passInput}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  autoComplete="current-password"
                  aria-invalid={showP && pHint.kind === "warn"}
                  className={cn(
                    "min-h-12 w-full rounded-2xl border bg-ink px-4 text-base text-paper transition-[border-color,box-shadow] duration-500 outline-none focus-visible:border-lime focus-visible:shadow-[0_0_0_4px_oklch(0.93_0.21_120/0.18)]",
                    showP && pHint.kind === "warn" ? "border-danger" : "border-white/12",
                  )}
                />
                <HintLine hint={showP ? pHint : { kind: "idle", text: pHint.text }} />
              </div>

              <Button type="submit" size="lg" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                    Checking your details
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={20} aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>

            <div
              ref={welcomeCard}
              aria-hidden={stage !== "welcome"}
              inert={stage !== "welcome"}
              className="pointer-events-auto col-start-1 row-start-1 flex w-full max-w-[440px] flex-col items-center gap-6 rounded-[40px] border border-white/10 bg-ink-2 p-8 text-center"
            >
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-3xl font-bold">Welcome back, {niceName(email)}</h2>
                <p className="text-mute">Your workspace synced while you were away.</p>
              </div>
              <dl className="grid w-full grid-cols-3 gap-2">
                {[
                  ["4", "boards", "bg-cobalt text-paper"],
                  ["12", "tasks due", "bg-paper-dim text-ink"],
                  ["3", "online", "bg-ink-3 text-paper"],
                ].map(([n, l, c]) => (
                  <div key={l} className={cn("flex flex-col gap-0 rounded-2xl p-4", c)}>
                    <dt className="sr-only">{l}</dt>
                    <dd className="font-display tnum text-2xl font-bold">{n}</dd>
                    <dd className="text-xs opacity-80">{l}</dd>
                  </div>
                ))}
              </dl>
              <Magnetic radius={40} className="w-full">
                <Button ref={enterBtn} size="lg" onClick={enter} className="w-full">
                  Enter Tessera
                  <ArrowRight size={20} aria-hidden="true" />
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      )}

      {stage === "site" && <Site email={email} />}
    </>
  );
}
