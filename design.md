 # Tamia Martin — A garden of possibilities

Web portfolio: an editorial, immersive sculpture garden with real interactive WebGL objects.

## Visual identity
- Paper #f3f2e9, forest ink #273b32, sage #b9c8ab, deep green #647d59, clay pink #dcaeac, butter #e8cb7f.
- Cormorant Garamond expressive display paired with Poppins body. Oversized italic accents and tracked small labels.
- Spacious editorial header and full-width atmospheric garden. Floating numbered labels and a bottom navigation dock.
- Circular terraced island, winding gravel paths, pastel sculptures on plinths, smooth stones and organic plants. Orthographic camera, soft shadows, ivory atmosphere.
- Restrained floating animation, orbit drag, reduced-motion support. Keyboard accessible alternative list.

## Screens and flows
- Home: garden, introduction, project navigation and view controls.
- Project panels: four real entries — Serenity Studios, Soft Power on Screen, Camilla’s and Theo’s Closet, DECA & NHS. Pink, butter, mint and muted lavender sculptures in a two-by-two arrangement; previous/next controls wrap across all four.
- About/contact panels: Tamia’s supplied biography and confirmed TamiaJmartin15@gmail.com address.
- No invented attendance, funds raised, project URLs or research downloads. Omit the unfinished result placeholder in the community entry.
- Editor: local-browser draft, Save, JSON export/import; no accounts or server storage. Explicit persistence notice.
- Modal panels trap focus and support Escape. Responsive mobile garden and list mode.

## Files and architecture
Web only: src/web/pages/portfolio.tsx, components/garden.tsx, components/panel.tsx, lib/portfolio.ts, styles.css. pages/index.tsx composes portfolio. No API routes or database tables needed. Keep managed analytics and app shell.