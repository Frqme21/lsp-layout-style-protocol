import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { gsap, prefersReduced } from "./lib/motion";
import Preloader from "./components/Preloader";
import Experience from "./components/Experience";
import NotFound from "./components/NotFound";

/** Hash routes: anything like "#/something" that is not "#/" is a missing page. */
const isMissing = (hash: string) => hash.startsWith("#/") && hash.length > 2;

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (prefersReduced()) gsap.globalTimeline.timeScale(6);
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (isMissing(hash)) return <NotFound path={hash.slice(1)} />;

  return (
    <MotionConfig reducedMotion="user">
      <Experience ready={ready} />
      {loading && <Preloader onReveal={() => setReady(true)} onDone={() => setLoading(false)} />}
    </MotionConfig>
  );
}
