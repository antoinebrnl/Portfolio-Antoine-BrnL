# Welcome and visit language

On computers the sequence is Mac startup → multilingual handwriting → language choice → login → desktop. Phones and tablets skip the Mac logo, progress bar and startup chime and begin with the multilingual handwriting. This also applies to simulated restarts on touch devices. The handwriting cycles through hello, bonjour, hola, ciao and こんにちは; the arrow skips directly to language selection. Reduced-motion preferences skip the handwriting. The radio group supports the keyboard, the language screen receives focus, and the layout fits mobile screens.

Device classification in `src/utils/device.ts` recognizes phones, Android tablets and iPadOS (including desktop-site mode), with a primary-touch-input fallback. It is captured once per launch so orientation changes do not replay startup. A narrow desktop window still keeps the Mac startup; the existing responsive application layout continues to follow viewport width independently.

`src/i18n/index.ts` keeps a validated `fr` / `en` choice in `sessionStorage` under `portfolio-visit-language`, with an in-memory fallback when storage is blocked. Reloading or restarting the simulated Mac keeps the language and skips setup for the rest of the tab's visit. A new browsing session presents setup again. The document's `lang` follows the selected language.

`src/i18n/translations.ts` pairs English interface strings with French translations. `localize()` is called at display boundaries, including configuration-driven labels; stored IDs, URLs, input values and command names are left intact. Add new interface phrases to this dictionary. Keep visitors' editable data in its original form. Date formatting uses the selected locale, and the French calendar starts on Monday. Siri recognition and voice selection follow the language; generated replies additionally require the existing optional Groq integration.

The presentation Markdown has dedicated English files in `public/markdown/en/`; French files remain in `public/markdown/`. External embedded websites, proper names and third-party content retain their own language settings.

Manual regression: start with empty session storage, check that greetings rotate, skip to the language screen, choose either language, sign in, check the Apple menu and profile biography, then reload. Repeat with the other language in a fresh browser context. Check a narrow mobile viewport, radio-button keyboard operation and reduced motion. With storage disabled, the choice must still work until navigation/reload.
