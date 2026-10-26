import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const cli = fileURLToPath(new URL("../node_modules/firebase-tools/lib/bin/firebase.js", import.meta.url));
const projectId = JSON.parse(readFileSync(new URL("../.firebaserc", import.meta.url), "utf8")).projects.default;
const siteId = JSON.parse(readFileSync(new URL("../firebase.json", import.meta.url), "utf8")).hosting.site;

function firebase(args, json = false) {
  const result = spawnSync(process.execPath, [cli, ...args, ...(json ? ["--json"] : [])], {
    cwd: root,
    stdio: json ? ["inherit", "pipe", "inherit"] : "inherit",
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    // JSON commands return public status/error information, never login tokens.
    if (json && result.stdout) console.error(result.stdout);
    throw new Error(`Firebase a interrompu la configuration (${args[0]}).`);
  }
  return json ? JSON.parse(result.stdout).result : undefined;
}

try {
  console.log(`Configuration du projet ${projectId} et du site ${siteId}.`);
  console.log("Connecte-toi avec le compte Google qui possède ce projet. Aucun mot de passe n'est demandé ici.");
  firebase(["login"]);
  const projects = firebase(["projects:list"], true);
  if (!Array.isArray(projects)) throw new Error("La liste des projets Firebase est indisponible.");
  if (!projects.some(project => project.projectId === projectId)) {
    firebase(["projects:addfirebase", projectId]);
  }
  const result = firebase(["hosting:sites:list", "--project", projectId], true);
  if (!Array.isArray(result?.sites)) throw new Error("La liste des sites Hosting est indisponible.");
  if (!result.sites.some(site => site.name.split("/").pop() === siteId)) {
    firebase(["hosting:sites:create", siteId, "--project", projectId, "--non-interactive"]);
  }
  console.log("Configuration terminée. Lance maintenant : pnpm run publier");
} catch (error) {
  console.error(error.message);
  console.error(`Vérifie l'accès au projet dans https://console.firebase.google.com/ et le compte connecté avec « pnpm exec firebase login:list ».`);
  process.exitCode = 1;
}
