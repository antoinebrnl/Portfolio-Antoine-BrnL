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

Metropolis is used for reading, menus, fields and controls. Orbitron is used for headings, large display numerals and window titles. Fonts are local and registered in `src/styles/font.css`; there is no Google Fonts request. The existing handwriting welcome animation and monospace terminal retain their purpose-specific fonts. A local monochrome Noto Emoji fallback renders pictograms as outlines in the inherited text color, including in French and English markdown.

Small primary actions use black text on terracotta. Links use the theme's readable text color and a terracotta underline. Every source paint uses one of the six palette colors; transparency, smooth tone transitions and anti-aliasing naturally blend those pigments.

`BrandFilters.tsx` defines the shared sRGB tone curve, using only black, dim gray, terracotta, taupe, platinum and off-white stops. `brand.css` applies it to images, video, canvas and embedded pages, including dynamically loaded content. Native app/file icons keep their recognizable silhouettes and transparency with neutral and terracotta tones. All four saved icon appearance modes compose this same treatment. Inverted monochrome toolbar icons and file-icon shadows also compose it. Do not override an image's `filter` without including `var(--brand-image-filter)`.

Native red/amber/green window buttons, weather graphics, battery indicators, online badges, map illustrations, code syntax and old utility color names use the brand palette too. Their symbols, position, labels and values continue to convey their meaning. Persisted accent values are validated against the six colors, and old named accent keys resolve to brand colors.

`Wallpaper.tsx` owns the background rendering. The default `pro-black-terracotta.png` is an edited version of Pro Black with restrained terracotta edge reflections. A dedicated filter neutralizes its gray tones and maps only the warm edge mask to the exact terracotta pigment. Other wallpaper choices use the common tone curve, including their appearance/display previews and Launchpad. Background brightness is applied only to the wallpaper layer so it cannot wash out interface or icon colors. Glass blur does not boost saturation, and containers must not add saturation filters over already treated assets.

When adding UI, use `--brand-cta`, `--brand-cta-ink`, `--brand-text`, `--brand-secondary` and the shared surface variables. Use the `font-display` class for headings and `font-sans` or the inherited font for body copy. Keep translations, startup device rules and session-language behavior independent of styling.
