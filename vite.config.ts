import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import unocss from "unocss/vite";
import autoImport from "unplugin-auto-import/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // A production bundle is public: keep the optional local Groq key out of it.
  // Siri's hosted AI integration will need a server endpoint before activation.
  define: command === "build" ? {
    "import.meta.env.VITE_GROQ_API_KEY": JSON.stringify("")
  } : {},
  plugins: [
    unocss(),
    react(),
    autoImport({
      imports: ["react"],
      dts: "src/auto-imports.d.ts",
      dirs: ["src/hooks", "src/stores", "src/components/**"]
    })
  ],
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`
    }
  }
}));
