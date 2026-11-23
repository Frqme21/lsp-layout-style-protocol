import { forwardRef } from "react";
import { cn } from "../utils/cn";

/** Tessera mark: four tiles. Each tile is its own SVG so the logo can split and reassemble. */
export const TILE_ORIGINS = ["26% 26%", "74% 26%", "26% 74%", "74% 74%"];
/** Tile centre offsets (px) inside a 160px logo box, measured from the box centre. */
export const TILE_OFFSETS = [
  { x: -38.4, y: -38.4 },
  { x: 38.4, y: -38.4 },
  { x: -38.4, y: 38.4 },
  { x: 38.4, y: 38.4 },
];

function TileShape({ i }: { i: number }) {
  switch (i) {
    case 0:
      return <path d="M4 48V26A22 22 0 0 1 26 4H48V48Z" className="fill-paper" />;
    case 1:
      return <circle cx="74" cy="26" r="22" className="fill-lime" />;
    case 2:
      return <rect x="4" y="52" width="44" height="44" rx="4" className="fill-cobalt-light" />;
    default:
      return <path d="M52 52H96V74A22 22 0 0 1 74 96H52Z" className="fill-paper-dim" />;
  }
}

export const LogoTile = forwardRef<SVGSVGElement, { i: number; className?: string }>(
  ({ i, className }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("absolute inset-0 h-full w-full overflow-visible", className)}
      style={{ transformOrigin: TILE_ORIGINS[i] }}
    >
      <TileShape i={i} />
    </svg>
  ),
);
LogoTile.displayName = "LogoTile";

/** Static logo for places outside the kinetic layer (404 page, footer). */
export function Logo({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <div
      role="img"
      aria-label="Tessera logo"
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {[0, 1, 2, 3].map((i) => (
        <LogoTile key={i} i={i} />
      ))}
    </div>
  );
}
