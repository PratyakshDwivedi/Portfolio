/**
 * ─────────────────────────────────────────────────────────────
 * PROFILE, core biographical facts.
 * Only verified information supplied by Pratyaksh. Do not add
 * achievements/titles here that were not provided.
 * ─────────────────────────────────────────────────────────────
 */
export const profile = {
  name: "Pratyaksh Dwivedi",
  initials: "PD",
  location: "Chennai, India",
  // The three interconnected identities that structure the whole site.
  identities: [
    {
      key: "software",
      label: "Software / Technology",
      tagline: "Systems, pipelines & green-tech engineering.",
    },
    {
      key: "founders",
      label: "Founders Club",
      tagline: "Leadership, community & entrepreneurship.",
    },
    {
      key: "music",
      label: "Tabla / Indian Classical",
      tagline: "Rhythm, discipline & cultural craft.",
    },
  ],
  // Home-page animated "identity object", reflects real background.
  identityObject: `const pratyaksh = {
  role: "engineer",
  builds: ["ml-pipelines", "cloud-systems"],
  leads: "Founders Club SRM",
  plays: "classical tabla",
  status: "always shipping",
};`,
} as const;
