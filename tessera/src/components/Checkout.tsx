import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Check, CreditCard, Loader2, Smartphone, Wallet, X } from "lucide-react";
import { EASE_ARRAY } from "../lib/motion";
import type { Plan } from "../lib/plans";
import { Button } from "./ui/button";
import { cn } from "../utils/cn";

type Errors = { number?: string; expiry?: string; cvc?: string };

function Sheet({ plan, email, onClose }: { plan: Plan; email: string; onClose: () => void }) {
  const [card, setCard] = useState(false);
  const [done, setDone] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [num, setNum] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const closeBtn = useRef<HTMLButtonElement>(null);
  const free = plan.price === 0;

  useEffect(() => {
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /** Optimistic: show success right away, confirm quietly in the background. */
  const succeed = () => {
    setDone(true);
    window.setTimeout(() => setConfirmed(true), 1600);
  };

  const payCard = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = num.replace(/\D/g, "");
    const next: Errors = {};
    if (digits.length !== 16) next.number = `Card number needs 16 digits. You entered ${digits.length}.`;
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) next.expiry = "Expiry should look like 08/28 (month, then year).";
    if (!/^\d{3}$/.test(cvc)) next.cvc = "CVC is the 3 digits printed on the back of your card.";
    setErrors(next);
    if (Object.keys(next).length === 0) succeed();
  };

  const input =
    "min-h-12 w-full rounded-2xl border bg-ink px-4 text-base text-paper tnum placeholder:text-mute/50 outline-none transition-[border-color,box-shadow] duration-500 focus-visible:border-lime focus-visible:shadow-[0_0_0_4px_oklch(0.93_0.21_120/0.18)]";

  return (
    <motion.div className="fixed inset-0 z-[90]" initial="hidden" animate="shown" exit="hidden">
      <motion.button
        type="button"
        aria-label="Close checkout"
        tabIndex={-1}
        onClick={onClose}
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
        transition={{ duration: 0.6, ease: EASE_ARRAY }}
        className="absolute inset-0 bg-ink/70"
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="co-title"
        variants={{ hidden: { x: "100%" }, shown: { x: 0 } }}
        transition={{ duration: 0.8, ease: EASE_ARRAY }}
        className="gpu absolute top-0 right-0 flex h-full w-[min(480px,100vw)] flex-col gap-8 overflow-y-auto border-l border-white/10 bg-ink-2 p-6 sm:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="co-title" className="font-display text-3xl font-bold">
            {done ? "You are in" : `${plan.name} plan`}
          </h2>
          <Button ref={closeBtn} variant="ghost" size="icon" onClick={onClose} aria-label="Close checkout">
            <X size={20} aria-hidden="true" />
          </Button>
        </div>

        {done ? (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 rounded-[32px] bg-ink-3 p-6">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-lime text-ink">
                <Check size={24} aria-hidden="true" />
              </span>
              <p className="font-display text-2xl font-bold">Welcome to {plan.name}.</p>
              <p className="max-w-[65ch] text-mute">
                {free
                  ? `Your free workspace is ready. We sent a welcome note to ${email}.`
                  : `Your 14 day trial has started. We sent a receipt to ${email}, and nothing is charged until the trial ends.`}
              </p>
            </div>
            <p aria-live="polite" className={cn("flex items-center gap-2 text-sm", confirmed ? "text-lime" : "text-mute")}>
              {confirmed ? (
                <>
                  <Check size={16} aria-hidden="true" /> {free ? "Workspace created" : "Payment method confirmed"}
                </>
              ) : (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" /> {free ? "Creating your workspace" : "Confirming with your bank"}
                </>
              )}
            </p>
            <Button size="lg" onClick={onClose} className="w-full">
              Open workspace
              <ArrowRight size={20} aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <>
            <dl className="tnum flex flex-col gap-2 rounded-[32px] bg-ink-3 p-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-mute">{plan.name}, 1 seat</dt>
                <dd>${plan.price.toFixed(2)} per month</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-mute">Receipt goes to</dt>
                <dd className="truncate">{email}</dd>
              </div>
              <div className="flex justify-between gap-4 pt-2 text-base font-semibold">
                <dt>Due today</dt>
                <dd>$0.00</dd>
              </div>
            </dl>

            {free ? (
              <Button size="lg" onClick={succeed} className="w-full">
                Create free workspace
                <ArrowRight size={20} aria-hidden="true" />
              </Button>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Button size="lg" onClick={succeed} className="w-full">
                    <Smartphone size={20} aria-hidden="true" />
                    Pay with Apple Pay
                  </Button>
                  <Button variant="secondary" size="lg" onClick={succeed} className="w-full">
                    <Wallet size={20} aria-hidden="true" />
                    Pay with Google Pay
                  </Button>
                </div>

                {!card ? (
                  <Button variant="ghost" onClick={() => setCard(true)} className="w-full">
                    <CreditCard size={18} aria-hidden="true" />
                    Use a card instead
                  </Button>
                ) : (
                  <motion.form
                    noValidate
                    onSubmit={payCard}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE_ARRAY }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-2">
                      <label htmlFor="cc-num" className="text-sm font-medium">Card number</label>
                      <input
                        id="cc-num"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="1234 5678 9012 3456"
                        value={num}
                        onChange={(e) =>
                          setNum(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())
                        }
                        className={cn(input, errors.number ? "border-danger" : "border-white/12")}
                      />
                      {errors.number && <FieldError text={errors.number} />}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="cc-exp" className="text-sm font-medium">Expiry</label>
                        <input
                          id="cc-exp"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          placeholder="MM/YY"
                          value={exp}
                          onChange={(e) => {
                            const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                            setExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                          }}
                          className={cn(input, errors.expiry ? "border-danger" : "border-white/12")}
                        />
                        {errors.expiry && <FieldError text={errors.expiry} />}
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="cc-cvc" className="text-sm font-medium">CVC</label>
                        <input
                          id="cc-cvc"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          placeholder="123"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                          className={cn(input, errors.cvc ? "border-danger" : "border-white/12")}
                        />
                        {errors.cvc && <FieldError text={errors.cvc} />}
                      </div>
                    </div>
                    <Button type="submit" variant="cobalt" size="lg" className="w-full">
                      Start trial with card
                    </Button>
                  </motion.form>
                )}
              </div>
            )}
            <p className="text-sm text-mute">Cancel any time before the trial ends and you pay nothing.</p>
          </>
        )}
      </motion.aside>
    </motion.div>
  );
}

function FieldError({ text }: { text: string }) {
  return (
    <p role="alert" className="flex items-start gap-2 text-[13px] leading-6 text-danger">
      <AlertCircle size={16} className="mt-1 shrink-0" aria-hidden="true" />
      {text}
    </p>
  );
}

export default function Checkout({ plan, email, onClose }: { plan: Plan | null; email: string; onClose: () => void }) {
  return <AnimatePresence>{plan && <Sheet key={plan.id} plan={plan} email={email} onClose={onClose} />}</AnimatePresence>;
}
