import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
  transformerAttributifyJsx
} from "unocss";

const colorReg = (prefix: string) => new RegExp("^" + prefix + "-([0-9a-z]+)(/(\\d+))?$");

const neutralPalette = { 50: '#f4f4f6', 100: '#e6e6e9', 200: '#e6e6e9', 300: '#9999a1', 400: '#9999a1', 500: '#66666e', 600: '#66666e', 700: '#000000', 800: '#000000', 900: '#000000', 950: '#000000' };
const accentPalette = { ...neutralPalette, 400: '#c86a52', 500: '#c86a52', 600: '#c86a52' };

const colorAttr = (prefix: string, [, color, , opacity]: RegExpMatchArray) => {
  let lightColor = "",
    darkColor = "";

  if (["black", "white"].includes(color)) {
    lightColor = color;
    darkColor = color === "white" ? "black" : "white";
  } else {
    lightColor = `gray-${color}`;
    darkColor = `gray-${(
      (+color === 900 || +color === 50 ? 950 : 900) - +color
    ).toString()}`;
  }

  const attr = `${prefix}-${lightColor}${opacity ? "/" + opacity : ""}`;
  const darkAttr = `${prefix}-${darkColor}${opacity ? "/" + opacity : ""}`;

  return `${attr} dark:${darkAttr}`;
};

export default defineConfig({
  safelist: [
    "i-ph:arrow-elbow-down-left",
    "i-ph:moon-stars",
    "i-ph:arrow-clockwise",
    "i-ph:power"
  ],
  shortcuts: [
    ["flex-center", "flex items-center justify-center"],
    ["hstack", "flex items-center"],
    ["vstack", "hstack flex-col"],
    ["no-outline", "outline-none focus:outline-none"],
    [colorReg("text-c"), (v) => colorAttr("text", v)],
    [colorReg("border-c"), (v) => colorAttr("border", v)],
    [colorReg("bg-c"), (v) => colorAttr("bg", v)],
    ["shadow-menu", "shadow-md shadow-black/25 dark:shadow-black/50"],
    ["window-btn", "size-3 text-black rounded-full flex-center no-outline"],
    ["border-menu", "border-gray-500/50"],
    [
      "menu-box",
      "fixed top-8.5 text-c-black dark:text-white"
    ],
    [
      "safari-btn",
      "h-6 outline-none focus:outline-none rounded flex-center border border-c-300"
    ],
    ["cc-btn", "flex-center rounded-full size-8 text-white bg-blue-500"],
    [
      "cc-btn-active",
      "flex-center rounded-full size-8 text-c-700 bg-gray-400/25 dark:bg-gray-300/25"
    ],
    ["cc-text", "text-xs text-c-500"],
    ["cc-grid", "bg-c-200/80 rounded-xl cc-grid-shadow backdrop-blur-2xl"],
    ["battery-level", "absolute rounded-[1px] h-2 top-1/2 -mt-1 ml-0.5 left-0"]
  ],
  rules: [["cc-grid-shadow", { "box-shadow": "0px 1px 5px 0px rgba(0, 0, 0, 0.3)" }]],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      warn: true,
      extraProperties: {
        display: "inline-block"
      }
    })
  ],
  theme: {
    colors: {
      accent: 'var(--brand-cta)',
      'brand-link': 'var(--brand-link)',
      black: '#000000',
      white: '#f4f4f6',
      gray: neutralPalette,
      slate: neutralPalette, zinc: neutralPalette, neutral: neutralPalette, stone: neutralPalette,
      // Legacy semantic and syntax utility names cannot reintroduce system colors.
      blue: accentPalette, red: accentPalette, orange: accentPalette, amber: accentPalette,
      yellow: accentPalette, lime: neutralPalette, green: neutralPalette, emerald: neutralPalette,
      teal: neutralPalette, cyan: neutralPalette, sky: neutralPalette, indigo: neutralPalette,
      violet: neutralPalette, purple: neutralPalette, fuchsia: accentPalette, pink: accentPalette, rose: accentPalette,
      neon: {
        purple: '#66666e',
        cyan: '#9999a1',
        orange: '#c86a52',
        mint: '#e6e6e9',
        yellow: '#c86a52'
      },
      dark: {
        navy: '#000000',
        deep: '#000000',
        slate: '#66666e'
      }
    },
    fontFamily: {
      sans: ['var(--font-system)'],
      display: ['var(--font-display)'],
      rounded: ['var(--font-rounded)'],
      mono: ['var(--font-mono)'],
    }
  },
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    // transformerAttributifyJsx()
  ]
});
