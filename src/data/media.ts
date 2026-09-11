/**
 * ─────────────────────────────────────────────────────────────
 * CENTRAL MEDIA REGISTRY
 *
 * Every image/video path used anywhere on the site lives here.
 * To swap a placeholder for a real asset, drop the file into
 * `public/assets/images` or `public/assets/videos` with the SAME
 * filename (or update the path below), no component edits needed.
 *
 * Missing files degrade gracefully: components fall back to a
 * generated placeholder UI instead of a broken <img>/<video>.
 * ─────────────────────────────────────────────────────────────
 */
export const media = {
  // Connect-page hero portrait (real photo).
  profile: "/assets/images/profile.jpg",

  // Home-page interactive Pixelated Canvas portrait (Pratyaksh pointing).
  pixelated: "/assets/images/pixelated.jpg",

  // Technical-page background portrait (tech stack floats around it).
  technicalBg: "/assets/images/technical-bg.jpg",

  // Home identity-card icons.
  fcLogo: "/assets/images/fc.jpg",
  tablaCard: "/assets/images/tablacard.jpg",

  // About-page cinematic background video (REAL, plays across the
  // pre-tabla About experience). Swapped to the "About Me New" asset;
  // all playback/scroll/audio-fade behavior is unchanged (see CinematicVideo).
  aboutBackgroundVideo: "/assets/videos/about-me-new.mp4",
  aboutBackgroundPoster: "/assets/images/about-poster-placeholder.jpg",

  // The ORIGINAL About background video, kept and reused for the hidden
  // "Click for Fun" easter-egg experience.
  funVideo: "/assets/videos/about-background.mp4",

  // Musical section, tabla. Photo is REAL; the featured tabla VIDEO
  // is still a placeholder until supplied.
  tablaPhoto: "/assets/images/tabla.jpg",
  tablaVideo: "/assets/videos/tabla-video-placeholder.mp4",
  tablaPoster: "/assets/images/tabla.jpg",

  // Tabla bol sounds for the interactive taal tiles + the full Teentaal cycle.
  // Drop the real audio files at these exact paths (public/assets/audio/…);
  // playback degrades gracefully (silent) until the files are present.
  tablaSounds: {
    Dha: "/assets/audio/dha.mp3",
    Dhin: "/assets/audio/dhin.mp3",
    Ta: "/assets/audio/ta.mp3",
    Tin: "/assets/audio/tin.mp3",
  } as Record<string, string>,
  teentaalFull: "/assets/audio/teentaal.mp3",

  // Shared fallbacks.
  eventPlaceholder: "/assets/images/event-placeholder.jpg",
  galleryPlaceholder: "/assets/images/gallery-placeholder.jpg",
  reelPlaceholder: "/assets/images/reel-placeholder.jpg",
} as const;

/**
 * Founders "Fun at Founders" wall, 36 real photos across three marquee rows.
 * Distinct from `reelGallery` below so no photo repeats on the page.
 */
export const funGallery: string[] = Array.from(
  { length: 36 },
  (_, i) => `/assets/images/fun/fun-${i + 1}.jpg`,
);

/**
 * Closing reel-gallery images for the Founders page.
 * Replace with real reel stills/covers.
 */
export const reelGallery: string[] = Array.from(
  { length: 10 },
  (_, i) => `/assets/images/reels/reel-${i + 1}.jpg`,
);
