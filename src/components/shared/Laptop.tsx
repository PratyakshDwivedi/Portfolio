import type { CSSProperties } from "react";

/**
 * The portfolio's silver laptop, shared by the Connect intro (resting on the
 * desk) and the page-transition rig (whose screen is the live page). Every size
 * is in em, where 1em = 1% of the lid's outer width, so the same laptop renders
 * identically at any size: set `font-size` on the laptop root to (outer / 100).
 */
export const LAPTOP = {
  bezel: 1.667,
  rim: 1.167,
  frame: 2.834, // bezel + rim
  screenW: 94.332,
  screenH: 58.958, // 16:10
  lidH: 64.626, // screen + 2 * frame
  hingeH: 0.667,
  boxH: 65.293, // lid + hinge (layout box; the deck hangs below it)
  screenCY: 32.313, // screen centre, measured from the top of the lid
  deckDepth: 64.626, // = lid height, so the closed lid sits flush on the base
  deckAngle: 74,
  lidRest: -5,
  lidClosed: -106, // lid lying on the deck: -(180 - deckAngle)
} as const;

/** Resting pose of the laptop on the Connect desk. */
export const INTRO = {
  outerMax: 600,
  rotX: 8,
  rotY: 26,
  rotYMobile: 14,
} as const;

/**
 * Where the laptop sits on the Connect desk for a given viewport, in px. The
 * ONE source of truth for both the desk scene (LaptopIntro) and the page
 * transition landing on it, so they always match exactly.
 *
 *  - landscape: the laptop takes 58% of the width (max 600px), lid near the
 *    top third, keyboard resting on the desk surface.
 *  - phones (< 640px): a larger laptop (88% of the width) so it stays usable.
 *  - portrait screens: the hinge sits at 62% of the height, so the laptop rests
 *    on the desk instead of floating above it on a tall screen.
 *  - never taller than the viewport allows (landscape phones).
 */
export function introLayout(W: number, H: number) {
  const outer = Math.min((W < 640 ? 0.88 : 0.58) * W, INTRO.outerMax, H);
  const em = outer / 100;
  const boxH = LAPTOP.boxH * em;
  const top =
    H > W
      ? 0.62 * H - LAPTOP.lidH * em
      : (H - boxH + (0.1 * H - Math.min(0.15 * H, 150) - 0.16 * H)) / 2;
  const hingeY = top + LAPTOP.lidH * em;
  return {
    outer,
    em,
    // margin-top that puts a flex-centred box of height boxH at `top`
    marginTop: 2 * top - H + boxH,
    cx: W / 2,
    cy: top + LAPTOP.screenCY * em,
    rx: INTRO.rotX as number,
    ry: (W <= 768 ? INTRO.rotYMobile : INTRO.rotY) as number,
    lid: LAPTOP.lidRest as number,
    // contact shadow (centre) under the keyboard deck
    shadowY: hingeY + 13 * em,
    shadowW: 0.96 * outer,
  };
}

/** The desk pose the page transition lands on / leaves from. */
export function introPose(innerW: number, innerH: number) {
  const l = introLayout(innerW, innerH);
  return { outer: l.outer, cx: l.cx, cy: l.cy, rx: l.rx, ry: l.ry, lid: l.lid };
}

const ALU = "linear-gradient(155deg,#f4f6f9 0%,#ccd1d9 55%,#b3b9c3 100%)";

/** Aluminum lid frame around the display (its back is hidden once it turns away). */
export const lidFrameStyle: CSSProperties = {
  position: "relative",
  background: ALU,
  borderRadius: "2.667em",
  padding: `${LAPTOP.bezel}em`,
  boxShadow: "0 5em 10em rgba(60,70,90,0.35)",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

/** Black glass rim between the frame and the display. */
export const lidRimStyle: CSSProperties = {
  background: "#08080a",
  borderRadius: "1.5em",
  padding: `${LAPTOP.rim}em`,
};

/** The display itself (content is clipped to it). */
export const screenStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "0.667em",
};

export function LaptopCameraNotch() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "50%",
        top: "0.833em",
        width: "0.5em",
        height: "0.5em",
        marginLeft: "-0.25em",
        borderRadius: "999px",
        background: "#3a3f47",
      }}
    />
  );
}

/** Back of the lid, seen once the lid closes past vertical. Offset slightly
 *  behind the display so a closed lid never z-fights with the keyboard deck. */
export function LaptopLidBack() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "2.667em",
        background: "linear-gradient(200deg,#eef1f5 0%,#cfd4dc 55%,#b3b9c3 100%)",
        boxShadow: "inset 0 0 0 0.15em rgba(255,255,255,0.4)",
        transform: "translateZ(-0.35em) rotateY(180deg)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    />
  );
}

export function LaptopHinge() {
  return (
    <div
      aria-hidden
      style={{
        margin: "0 auto",
        height: `${LAPTOP.hingeH}em`,
        width: "86%",
        borderRadius: "0 0 0.5em 0.5em",
        background: "linear-gradient(180deg,#aeb4be,#8f96a2)",
      }}
    />
  );
}

/** Keyboard deck, hanging from the hinge and folded toward the viewer. As deep
 *  as the lid is tall, with a front face and sides for the base's thickness. */
export function LaptopDeck() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: "100%",
        left: "0.5%",
        width: "99%",
        height: `${LAPTOP.deckDepth}em`,
        transformOrigin: "top center",
        transform: `rotateX(${LAPTOP.deckAngle}deg)`,
        transformStyle: "preserve-3d",
        background: "linear-gradient(180deg,#eceff3 0%,#d3d8df 55%,#c0c6d0 100%)",
        boxShadow: "inset 0 0.167em 0 rgba(255,255,255,0.7)",
        borderRadius: "0 0 1.667em 1.667em",
      }}
    >
      {/* keyboard well */}
      <div
        style={{
          position: "absolute",
          left: "6%",
          right: "6%",
          top: "7%",
          height: "44%",
          borderRadius: "0.667em",
          background: "#c6ccd4",
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 6.5%), repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 16.66%)",
          boxShadow: "inset 0 0.167em 0.333em rgba(0,0,0,0.15)",
        }}
      />
      {/* trackpad */}
      <div
        style={{
          position: "absolute",
          left: "31%",
          width: "38%",
          bottom: "7%",
          height: "36%",
          borderRadius: "0.833em",
          background: "linear-gradient(180deg,#e2e6eb,#d1d6dd)",
          boxShadow: "inset 0 0 0 0.167em rgba(0,0,0,0.08)",
        }}
      />
      {/* opening notch on the front edge */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "42%",
          width: "16%",
          height: "0.5em",
          borderRadius: "0.667em 0.667em 0 0",
          background: "#b7bdc7",
        }}
      />
      {/* front face (base thickness) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "100%",
          height: "1.2em",
          transformOrigin: "top center",
          transform: "rotateX(-90deg)",
          background: "linear-gradient(180deg,#c9ced6,#9aa1ac)",
          borderRadius: "0 0 0.6em 0.6em",
        }}
      />
      {/* side faces */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "1.2em",
          transformOrigin: "left center",
          transform: "rotateY(90deg)",
          background: "linear-gradient(90deg,#b9bfc8,#a3aab5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: "1.2em",
          transformOrigin: "right center",
          transform: "rotateY(-90deg)",
          background: "linear-gradient(90deg,#a3aab5,#b9bfc8)",
        }}
      />
    </div>
  );
}

/**
 * A glimpse of the Connect hero shown "on the laptop screen": the real
 * ConnectHero content (oversized back word + name) so the hand-off between the
 * laptop and the actual page reads as continuous. Sized in container-query
 * units so it scales with whatever screen it sits in.
 */
export function ScreenPreview() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-page [container-type:size]">
      <div className="pointer-events-none absolute inset-x-0 top-[8%] text-center text-[22cqw] font-bold leading-none text-content/[0.06]">
        LET'S TALK
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[4cqw] text-center">
        <p className="mb-[1.5cqw] font-mono text-[3cqw] uppercase tracking-[0.3em] text-muted">
          Connect with me
        </p>
        <h2 className="text-display text-[18cqw] leading-[0.85] text-content">
          Pratyaksh
        </h2>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.05]" />
    </div>
  );
}

/** Custom desk wall colour (our own gradient, not a photo). */
export const DESK_WALL =
  "radial-gradient(120% 100% at 68% 2%, #f3f5f8 0%, #e7ebf0 50%, #dde2e9 100%)";

/**
 * The Connect desk environment, built from layered CSS (no photo): daylight
 * wall, window light, abstract greenery, a receding desk surface with a lit
 * front edge and apron, and a contact shadow under the laptop (positioned from
 * `introLayout`, so it sits under the keyboard on every screen shape).
 */
export function DeskEnvironment({ shadowY, shadowW }: { shadowY: number; shadowW: number }) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0" style={{ background: DESK_WALL }} />
      {/* soft window light from the upper right */}
      <div
        className="pointer-events-none absolute -right-[10%] -top-[15%] h-[70%] w-[55%] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.75), transparent 70%)" }}
      />
      {/* gentle out-of-focus greenery atmosphere (abstract, not a plant photo) */}
      <div
        className="pointer-events-none absolute -left-[6%] top-[2%] h-[42%] w-[26%] rounded-full blur-[46px]"
        style={{ background: "radial-gradient(closest-side, rgba(120,168,104,0.22), transparent 72%)" }}
      />
      <div
        className="pointer-events-none absolute right-[6%] top-[1%] h-[36%] w-[22%] rounded-full blur-[48px]"
        style={{ background: "radial-gradient(closest-side, rgba(132,176,118,0.18), transparent 72%)" }}
      />

      {/* desk: receding top surface, ambient occlusion at the wall, lit front
          edge and a darker front apron, so it reads as a physical table */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%]">
        <div
          className="absolute inset-x-0 top-0 h-[16%]"
          style={{ background: "linear-gradient(180deg, rgba(116,128,150,0.16), transparent)" }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[64%]"
          style={{
            background:
              "linear-gradient(180deg, #e7ebf1 0%, #f3f6f9 55%, #ffffff 100%), radial-gradient(120% 160% at 72% 130%, rgba(255,255,255,0.85), transparent 62%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-[63%] h-[2.5%]"
          style={{ background: "linear-gradient(180deg, #ffffff, #e2e7ee)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 top-[65%]"
          style={{
            background: "linear-gradient(180deg, #dbe1e8 0%, #ccd3dc 100%)",
            boxShadow: "inset 0 12px 24px rgba(116,128,150,0.10)",
          }}
        />
      </div>

      {/* grounding contact shadow under the laptop base */}
      <div
        className="pointer-events-none absolute left-1/2 h-16 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-black/25 blur-3xl"
        style={{ top: shadowY, width: shadowW }}
      />
    </>
  );
}
