/**
 * ─────────────────────────────────────────────────────────────
 * CENTRAL CONTACT / SOCIAL CONFIG
 *
 * Replace the PLACEHOLDER strings below with your real URLs.
 * Every button/link across the site reads from here, so you only
 * ever edit this one file, never the components.
 * ─────────────────────────────────────────────────────────────
 */
export const socialLinks = {
  linkedin: "https://www.linkedin.com/in/pratyakshdwiv/",

  github: "https://github.com/PratyakshDwivedi",

  instagram: "https://www.instagram.com/_pratyakshdwivedi_/",

  // 👉 Paste your resume Google Drive share link (Anyone-with-link → view)
  resume: "RESUME_DRIVE_URL_HERE",

  // ✅ Real phone number, rendered as a tel: link.
  phone: "+917991664704",

  // Contact email (used for the mailto CTA).
  email: "dwivedipratyaksh07@gmail.com",
} as const;

/** True when a link is still an unreplaced placeholder. */
export const isPlaceholder = (value: string) =>
  value.endsWith("_HERE") || value.trim() === "";

/** tel: href built from the phone number. */
export const telHref = `tel:${socialLinks.phone}`;
