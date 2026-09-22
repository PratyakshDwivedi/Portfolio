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

/** Resting pose of the laptop on the Connect desk (desktop). */
export const INTRO = {
  outerVw: 0.58,
  outerMax: 600,
  rotX: 8,
  rotY: 26,
  rotYMobile: 14,
  // margin-top of the laptop in the desk scene: calc(a vh - min(b vh, c px) + d vh)
  mt: { a: 10, b: 15, c: 150, d: -16 },
} as const;

export const INTRO_FONT_SIZE = `min(${INTRO.outerVw * 100}vw, ${INTRO.outerMax / 100}px)`;
export const INTRO_MARGIN_TOP = `calc(${INTRO.mt.a}vh - min(${INTRO.mt.b}vh, ${INTRO.mt.c}px) + ${INTRO.mt.d}vh)`;

/** Same geometry as the CSS above, in px, so the transition can land exactly
 *  where the Connect desk scene draws the laptop. */
export function introPose(innerW: number, innerH: number) {
  const outer = Math.min(INTRO.outerVw * innerW, INTRO.outerMax);
  const em = outer / 100;
  const mt =
    (INTRO.mt.a / 100) * innerH -
    Math.min((INTRO.mt.b / 100) * innerH, INTRO.mt.c) +
    (INTRO.mt.d / 100) * innerH;
  // flex-centred item with a top margin: its border box starts here
  const top = (innerH - LAPTOP.boxH * em + mt) / 2;
  return {
    outer,
    cx: innerW / 2,
    cy: top + LAPTOP.screenCY * em,
    rx: INTRO.rotX,
    ry: INTRO.rotY,
    lid: LAPTOP.lidRest,
  };
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
 * front edge and apron, and a contact shadow under the laptop.
 */
export function DeskEnvironment() {
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
      <div className="pointer-events-none absolute left-1/2 top-[71%] h-16 w-[54vw] max-w-[580px] -translate-x-1/2 rounded-[50%] bg-black/25 blur-3xl" />
    </>
  );
}
