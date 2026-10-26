# Publication du portfolio chez Google

## Configuration préparée

- Projet Google Cloud : `project-c3bfb111-69c7-4d37-9c0`.
- Site Firebase Hosting dédié : `antoine-brnl-c3bfb111`.
- Dossier publié : `dist`, reconstruit à chaque publication.
- URL prévue après la première publication : `https://antoine-brnl-c3bfb111.web.app`.
- Node.js 22 ou 24 et pnpm 9.0.6 ; la CLI Firebase est installée avec le projet.

Cette configuration ne prouve pas que le projet a déjà Firebase activé ou que le compte connecté peut l'administrer. La connexion initiale ci-dessous vérifie l'accès et prépare le site. Aucun compte Google ni mot de passe n'est enregistré dans Git.

## Première connexion et première publication sur le Mac

Dans le dossier `portfolio-antoine-brunel` :

```bash
git pull portfolio main
pnpm install --frozen-lockfile
pnpm run configurer:firebase
pnpm run publier
```

`configurer:firebase` ouvre la connexion Google dans le navigateur. Choisir le compte propriétaire du projet. Le script vérifie les projets accessibles, ajoute Firebase au projet existant si nécessaire, puis crée le site Hosting dédié s'il manque. Il ne crée pas de nouveau projet Google Cloud ni de compte de facturation. Si le compte possède déjà la configuration, les ressources existantes sont conservées.

Si le mauvais compte est connecté : `pnpm exec firebase login --reauth`, puis relancer la configuration. En cas de refus d'accès, vérifier les droits sur le projet dans [Firebase](https://console.firebase.google.com/) avec le propriétaire du projet.

`publier` lance `verifier` (ESLint et TypeScript), puis la compilation Vite et la publication de Hosting. Une erreur arrête le déploiement. Le résultat affiche l'URL publique à ouvrir sur l'iPhone, en Wi-Fi ou en 4G/5G. Garder cet onglet pour comparer les futures mises à jour.

Pour publier ensuite les modifications du dossier local :

```bash
pnpm run publier
```

Si le code a été modifié et poussé depuis l'environnement cloud, le récupérer d'abord avec `git pull portfolio main`. Quand la publication GitHub automatique sera activée, cette étape manuelle ne sera plus nécessaire pour mettre le site en ligne.

## Publication automatique après un push sur main

Le workflow `.github/workflows/firebase-hosting.yml` est prêt. Il reste inactif tant que la connexion Google/GitHub n'a pas été établie. Il utilise Workload Identity Federation : aucune clé privée de compte de service n'est téléchargée ni enregistrée dans les secrets GitHub.

Après une première publication réussie, installer la [CLI Google Cloud](https://cloud.google.com/sdk/docs/install) et [GitHub CLI](https://cli.github.com/) sur le Mac. Puis, avec le propriétaire du projet Google et un administrateur du dépôt :

```bash
pnpm run configurer:publication-auto
```

Ce script prépare dans le projet :

1. Les API IAM, IAM Credentials et Security Token Service.
2. Le compte de service `portfolio-deploy`, avec les rôles Firebase Hosting Admin et Service Usage Consumer.
3. Un pool d'identités GitHub et un fournisseur OIDC limité à l'identifiant immuable de ce dépôt, à son propriétaire et à `refs/heads/main`.
4. Les variables GitHub `GCP_SERVICE_ACCOUNT` et `GCP_WORKLOAD_IDENTITY_PROVIDER`.

Il déclenche ensuite le workflow. Les identifiants de projet et les variables sont des métadonnées publiques. Les identifiants temporaires d'authentification sont créés uniquement pendant l'exécution GitHub Actions.

Une fois cette connexion activée, chaque commit poussé sur `main` publie le site. Depuis le Mac, pour du code déjà commité : `git push portfolio main`. Les commits poussés depuis l'environnement cloud déclenchent la même publication. Le résultat se suit dans l'[onglet Actions](https://github.com/antoinebrnl/Portfolio-Antoine-BrnL/actions).

La création des identités Google peut prendre quelques minutes à se propager. Si la première exécution échoue pour ce motif, relancer le workflow dans Actions après cette propagation.

La configuration automatique modifie des permissions IAM : elle doit être exécutée par un compte autorisé à administrer IAM dans ce projet. Si les politiques de l'organisation refusent une étape, le script s'arrête et conserve le message de Google.

## Domaine et facturation

Après la première publication, ouvrir Hosting dans la console Firebase, sélectionner `antoine-brnl-c3bfb111`, puis « Ajouter un domaine personnalisé ». Saisir le domaine souhaité et utiliser uniquement les enregistrements DNS fournis par Firebase pour ce domaine. Les éventuels enregistrements de messagerie doivent être conservés. Le certificat HTTPS est ensuite provisionné par Firebase ; l'activation DNS peut prendre du temps.

Le domaine peut rester chez son gestionnaire actuel. Le compte de facturation et les crédits doivent être vérifiés dans Google Cloud : ce dépôt ne modifie pas la facturation et ne garantit pas l'éligibilité des crédits. Commencer par contrôler le compte rattaché au projet et les quotas applicables à Hosting.

## Statistiques : étape après la première publication

Google Analytics 4 et Search Console ne sont pas encore activés : aucun identifiant de mesure, de propriété ni domaine définitif n'a été fourni. Aucun traceur Analytics n'est chargé par cette préparation.

La suite : créer un flux Web GA4 pour le domaine retenu, intégrer son identifiant public `G-…` avec un choix de consentement avant tout chargement Analytics, puis vérifier le domaine dans Search Console avec l'enregistrement DNS fourni par Google. Les clics sur les projets, le CV et le contact pourront ensuite devenir des événements mesurés. Les chiffres et graphiques ne seront visibles qu'après réception de visites réelles.

## Vérifications et configuration technique

```bash
pnpm run verifier
pnpm run tester:hebergement
```

Le deuxième test construit le site puis utilise uniquement l'émulateur local Hosting, avec un projet de démonstration sans accès au projet réel. Il vérifie les routes, les types de fichiers servis, les fichiers importants et les en-têtes de cache. Hosting exige la revalidation du cache pour afficher les mises à jour sans conserver une ancienne image ou page.

Les fichiers de conception macOS `.dmg`, `.icns` et `.heic`, inutilisés par l'interface Web, sont exclus de la publication. Les images Web, les polices, les documents et l'audio restent disponibles.

Le build de production remplace `VITE_GROQ_API_KEY` par une valeur vide, même si le Mac a encore une clé dans `.env`. L'IA distante de Siri reste à raccorder à un point d'accès serveur ; il ne faut pas publier une clé privée dans une variable `VITE_*`. Les autres fonctions du portfolio et le son de démarrage sont indépendants de cette clé.
