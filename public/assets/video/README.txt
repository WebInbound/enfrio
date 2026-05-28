Video assets for the M Tower flagship pages.

The site auto-detects which of these files are present and lights up
the matching experience. None of them are required — every component
falls back gracefully to a still poster
(public/assets/images/site/mtower-real.jpg).

================================================================
mtower-360.mp4  -- highest impact, scroll-driven + drag-to-rotate
================================================================
A full 360° turntable render of the M Tower unit.

- Subject: one M Tower module, isolated, on neutral/transparent bg
- Camera: orbits 360° around the unit at eye level
- Length: 5-10 seconds (10s = smoother)
- Frame rate: 24-30 fps (more frames = silkier rotation)
- Codec: H.264, level 4.1 or below
- Resolution: 1920x1080 (or 1080x1350 for portrait)
- Audio: stripped (the page plays it muted anyway)
- Loopable: first frame must match the last frame

When present:
- /tower-m hero binds video.currentTime to the page scroll position:
  scrolling DOWN rotates the unit clockwise.
- The "Explore the unit" section under the hero lets the visitor
  drag the cursor (or swipe on touch) horizontally to spin freely.

================================================================
mtower-3d.mp4  -- ambient hero loop (used if mtower-360.mp4 is absent)
================================================================
Any cinematic render of the M Tower that loops cleanly.

- 4-8 seconds
- 1920x1080, H.264
- Bitrate ~4-6 Mbps
- Loopable

When present (and mtower-360.mp4 is not):
- /tower-m hero plays it as a muted autoplay loop in the background.

================================================================
mtower-loop.mp4  -- micro loop for the configurator modules
================================================================
A tight close-up loop of a single M Tower module — fans spinning,
LEDs blinking on the inverter, anything that reads as "alive" at
very small size (~80px wide).

- 3-6 seconds
- 480x600 portrait crop is plenty, H.264, light bitrate (1-2 Mbps)
- Loopable

When present:
- The configurator's photoreal builder swaps each module from the
  still photo (mtower-module.jpg) to this looping video. The bank
  becomes a row of breathing units instead of a row of stills.

================================================================
Tips
================================================================
- All three files can coexist. The site picks the best one
  available for each surface.
- If the file is missing or fails to load, no error is shown to the
  visitor — the static poster is used instead.
- Keep total page weight in mind: under 8 MB for the 360 render and
  under 3 MB for the ambient loop is a good target on mobile.
