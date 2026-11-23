export type Plan = {
  id: "solo" | "team" | "scale";
  name: string;
  price: number;
  blurb: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "solo",
    name: "Solo",
    price: 0,
    blurb: "For one person with a lot on their plate.",
    features: ["3 boards", "Unlimited docs", "Offline mode"],
    cta: "Create free workspace",
  },
  {
    id: "team",
    name: "Team",
    price: 12,
    blurb: "For small teams that ship every week.",
    features: ["Unlimited boards", "Rules and automations", "Shared docs and comments", "14 day free trial"],
    cta: "Start 14 day trial",
    featured: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 32,
    blurb: "For teams that need control and audit trails.",
    features: ["Everything in Team", "Single sign-on", "Audit log", "Priority support"],
    cta: "Choose Scale",
  },
];
