# Antoine BrnL — interface identity

The colors and typography below follow the four reference screenshots supplied by the project owner.

| Role | Value |
| --- | --- |
| Black | `#000000` |
| Anti-flash white | `#F4F4F6` |
| Dim gray | `#66666E` |
| Taupe gray | `#9999A1` |
| Platinum | `#E6E6E9` |
| Terracotta / action | `#C86A52` |

`src/styles/brand.css` owns the shared tokens, glass surfaces, links, focus rings and light/dark roles. UnoCSS aliases in `unocss.config.ts` keep legacy blue utilities consistent with the brand. Inline application styles use the same palette. The Appearance panel offers the terracotta brand accent; a one-time preference migration clears the old system-blue accent.

Metropolis is used for reading, menus, fields and controls. Orbitron is used for headings, large display numerals and window titles. Fonts are local and registered in `src/styles/font.css`; there is no Google Fonts request. The existing handwriting welcome animation and monospace terminal retain their purpose-specific fonts. Photos, the selected Pro Black wallpaper, external websites, third-party app icons and semantic system indicators (window traffic lights, battery warnings, online status) retain their native imagery or meaning.

Small primary actions use black text on terracotta. Links use a darker terracotta in light mode and a lighter one in dark mode for readability. Transparent variants and hover/focus shades are derived from the palette.

When adding UI, use `--brand-cta`, `--brand-cta-ink`, `--brand-text`, `--brand-secondary` and the shared surface variables. Use the `font-display` class for headings and `font-sans` or the inherited font for body copy. Keep translations, startup device rules and session-language behavior independent of styling.
