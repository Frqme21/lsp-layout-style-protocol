import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Magnetic } from "./Magnetic";
import { EASE_ARRAY } from "../lib/motion";

export default function NotFound({ path }: { path: string }) {
  return (
    <main className="dot-grid flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, rotate: -120, scale: 0.4 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE_ARRAY }}
      >
        <Logo size={96} />
      </motion.div>
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_ARRAY, delay: 0.3 }}
      >
        <p className="font-display tnum text-[clamp(88px,18vw,200px)] leading-[0.85] font-bold text-cobalt-light">404</p>
        <h1 className="font-display text-3xl font-bold">This tile is missing.</h1>
        <p className="max-w-[65ch] text-mute">
          There is no page at <span className="text-paper">{path}</span>. The link may be old, or the address has a typo.
        </p>
      </motion.div>
      <Magnetic radius={48}>
        <Button size="lg" onClick={() => (window.location.hash = "")}>
          <ArrowLeft size={20} aria-hidden="true" />
          Back to Tessera
        </Button>
      </Magnetic>
    </main>
  );
}
