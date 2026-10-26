# Portfolio Antoine BrnL

Portfolio interactif inspiré de macOS : React, TypeScript, Vite, Zustand et UnoCSS. Interface français/anglais, présentation adaptée aux ordinateurs, tablettes et téléphones, palette et typographies Antoine BrnL.

## Développement

Avec Node.js 22 ou 24 et pnpm 9.0.6 :

```bash
pnpm install --frozen-lockfile
pnpm dev
```

## Publication sur Firebase Hosting

La configuration cible le projet Google Cloud `project-c3bfb111-69c7-4d37-9c0` et son site Hosting dédié `antoine-brnl-c3bfb111`.

Première connexion Google et préparation du site :

```bash
pnpm run configurer:firebase
```

Puis, pour publier la version du dossier local en une commande :

```bash
pnpm run publier
```

Cette commande vérifie le code, reconstruit le site et publie le dossier `dist`. La connexion initiale au compte Google est nécessaire. Les détails du domaine, de la publication GitHub automatique et des statistiques sont dans [le guide Firebase](docs/firebase-hosting.md).

## Vérifications

```bash
pnpm run verifier
pnpm run tester:hebergement
```

Le test d'hébergement utilise un émulateur local et un projet de démonstration. Il ne publie rien sur le projet réel.

## Crédits

Basé sur [macOS-Portfolio par aakashsharma003](https://github.com/aakashsharma003/macOS-Portfolio), personnalisé pour Antoine BrnL. Voir les licences conservées dans le dépôt et [les sources des ressources](docs/asset-sources.md).
