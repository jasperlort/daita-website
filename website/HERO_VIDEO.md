# Hero background video

The hero section plays `public/videos/hero.mp4` on loop, autoplay, muted, behind the DAITA wordmark.

The file currently shipped is the placeholder clip from the design handoff bundle. **Swap it for the hyperrealistic "clouds → top-down city zoom" clip** once it's generated.

## Constraints

- **Duration:** 10–15 s (loops seamlessly — end should roughly match start).
- **Format:** H.264 MP4, 1920×1080 or 2560×1440, ≤ 10 MB.
- **No audio track** (muted anyway — drop it to save bytes).
- **Mood:** cinematic, dim, slightly desaturated. The teal/ink veil on top reads better over a slightly dark base.

## Prompt (Sora / Dream Machine / Runway Gen-4)

> Cinematic top-down aerial shot, starting high above soft volumetric cumulus clouds in golden-hour light. The camera descends slowly and smoothly through the cloud layer, parting them to reveal a photorealistic modern city far below — dense rooftops, glass towers, street grids, car headlights, warm amber streetlamps. The descent continues steadily from stratospheric altitude down to roughly 500 m above the buildings, the city coming into focus with hyperreal detail: reflective windows, wet asphalt, crisp shadows, light haze. Subtle atmospheric volumetrics, 35 mm photographic feel, shallow depth cueing, slight anamorphic flare, no text, no logos, no people, no camera shake. 16:9, 10 s, seamless loop-friendly motion.

## Drop-in

Generate the clip, then:

```bash
cp <your-generated-clip>.mp4 website/public/videos/hero.mp4
```

No code changes needed — the page references `/videos/hero.mp4` directly.
