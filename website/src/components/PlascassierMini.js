'use client';

/*
 * PlascassierMini — pre-baked alpha-channel WebM of Plascassier
 * (Provence, FR) rendered from Google's Photorealistic 3D Tiles.
 * Produced once via a Playwright + 3d-tiles-renderer headless capture
 * (see /tmp/render-plascassier on the build machine), then encoded with
 * VP9 + yuva420p so the sky is transparent and the video drops cleanly
 * onto the teal final-section background.
 */
export default function PlascassierMini() {
  return (
    <div className="plascassier-mini">
      <video
        src="/videos/plascassier.webm"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label="Plascassier, Provence — rotating photorealistic 3D capture"
      />
      <div className="plascassier-mini__attr">© Google · Plascassier</div>
    </div>
  );
}
