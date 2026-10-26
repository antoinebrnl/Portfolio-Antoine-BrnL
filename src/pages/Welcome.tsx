import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { setLanguage, type Language } from "~/i18n";
import "~/styles/welcome.css";

const greetings = ["hello", "bonjour", "hola", "ciao", "こんにちは"];
export default function Welcome() {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState<"hello" | "language">("hello");
  const [greeting, setGreeting] = useState(0);
  const [selected, setSelected] = useState<Language>("fr");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (step !== "hello") return;
    if (reducedMotion) { setStep("language"); return; }
    const timer = window.setTimeout(() => {
      if (greeting === greetings.length - 1) setStep("language");
      else setGreeting((value) => value + 1);
    }, 1700);
    return () => window.clearTimeout(timer);
  }, [greeting, step, reducedMotion]);
  useEffect(() => { if (step === "language") heading.current?.focus(); }, [step]);
  return (
    <main className="welcome-screen" aria-label="Bienvenue / Welcome">
      <div className="welcome-aura welcome-aura-blue" aria-hidden="true" />
      <div className="welcome-aura welcome-aura-peach" aria-hidden="true" />
      <AnimatePresence mode="wait">
        {step === "hello" ? (
          <motion.section key="hello" className="welcome-hello" exit={{ opacity: 0, filter: reducedMotion ? "none" : "blur(12px)" }} transition={{ duration: 0.5 }}>
            <span className="welcome-eyebrow">ANTOINE BRNL</span>
            <div className="welcome-writing" aria-hidden="true">
              <AnimatePresence mode="wait">
                <motion.svg key={greeting} viewBox="0 0 1000 270" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="welcome-script">{greetings[greeting]}</text>
                </motion.svg>
              </AnimatePresence>
            </div>
            <p className="welcome-intro">Un monde d’idées. A world of possibilities.</p>
            <button className="welcome-next" onClick={() => setStep("language")} aria-label="Choisir une langue / Choose a language">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </motion.section>
        ) : (
          <motion.section lang={selected} key="language" className="welcome-language" initial={reducedMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <svg className="welcome-globe" width="65" height="65" viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="32" cy="32" r="25" stroke="currentColor" strokeWidth="1.4"/><ellipse cx="32" cy="32" rx="11" ry="25" stroke="currentColor" strokeWidth="1.4"/><path d="M7 32h50M12 18h40M12 46h40" stroke="currentColor" strokeWidth="1.4"/></svg>
            <h1 ref={heading} tabIndex={-1}>{selected === "fr" ? "Bienvenue" : "Welcome"}</h1>
            <p className="welcome-subtitle">{selected === "fr" ? "Choisissez votre langue pour découvrir mon univers." : "Choose your language and make yourself at home."}</p>
            <fieldset className="welcome-options">
              <legend className="welcome-sr-only">Français / English</legend>
              {(["fr", "en"] as const).map((language) => (
                <label key={language} className={`welcome-option ${selected === language ? "is-selected" : ""}`}>
                  <input type="radio" name="language" value={language} checked={selected === language} onChange={() => setSelected(language)} />
                  <span lang={language}>{language === "fr" ? "Français" : "English"}</span>
                  <span className="welcome-option-note">{language === "fr" ? "France" : "United Kingdom"}</span>
                  <span className="welcome-check" aria-hidden="true">{selected === language ? "✓" : ""}</span>
                </label>
              ))}
            </fieldset>
            <button className="welcome-continue" onClick={() => setLanguage(selected)}>{selected === "fr" ? "Continuer" : "Continue"}<span aria-hidden="true"> →</span></button>
            <p className="welcome-footnote">{selected === "fr" ? "Votre choix sera conservé pendant cette visite." : "Your choice will be remembered for this visit."}</p>
          </motion.section>
        )}
      </AnimatePresence>
      <footer className="welcome-footer">Antoine BrnL <span>·</span> Portfolio</footer>
    </main>
  );
}
