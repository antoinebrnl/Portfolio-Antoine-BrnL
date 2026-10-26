# Domaines et coût de Firebase Hosting

## Raccordement depuis le Terminal

Le fichier `hosting-domains.json` prépare `antoine-brnl.com` comme domaine principal et `datahorizon.dev` comme redirection HTTP 301 vers le premier. Les deux se rattachent au site `antoine-brnl-c3bfb111` dans `project-c3bfb111-69c7-4d37-9c0`.

Première commande, après avoir récupéré le code à jour :

```bash
git pull portfolio main
pnpm run domaines
```

Cette commande réutilise la connexion Google de la CLI Firebase. Elle ajoute les domaines dans Firebase s'ils manquent et récupère les instructions DNS réelles de Google, y compris les éventuelles validations du certificat. Elle n'invente ni adresse IP ni valeur de validation et ne modifie pas les DNS.

Elle vérifie ensuite les zones publiques accessibles dans Cloud DNS, leur délégation réelle et les enregistrements existants. Le rapport et le plan sont conservés localement dans `.cache/firebase-domains-plan.json` (ignoré par Git). Aucun jeton OAuth n'est affiché ou écrit dans ce rapport.

Si les zones correspondantes sont effectivement gérées dans Cloud DNS et que le plan est complet :

```bash
pnpm run domaines --apply
```

Cette deuxième commande recalcule le plan sur les enregistrements actuels avant de l'appliquer. Les transactions DNS ne concernent que les noms de domaine configurés et les instructions explicites fournies par Firebase. Les MX et les TXT de messagerie sont conservés. Le script n'achète pas de domaine, ne crée pas de zone payante et ne change pas les serveurs DNS du registrar.

Il s'arrête si la délégation ne correspond pas à la zone trouvée, si un conflit de CNAME ou une règle de routage complexe nécessite une vérification, ou si les adresses existantes ne sont pas couvertes par les instructions Firebase. Tous les plans sont vérifiés avant la première transaction DNS. En cas d'erreur réseau après une transaction déjà acceptée, la commande peut être relancée : elle relit les DNS pour éviter de réappliquer les mêmes changements.

Si les zones sont dans un autre projet Google Cloud :

```bash
pnpm run domaines --dns-project ID_DU_PROJET_DNS
pnpm run domaines --apply --dns-project ID_DU_PROJET_DNS
```

L'option `--domain antoine-brnl.com` ou `--domain datahorizon.dev` permet de traiter un seul domaine, par exemple si leurs zones appartiennent à des projets différents. Les identifiants passés doivent correspondre aux projets réels.

L'accès aux zones nécessite les permissions Cloud DNS correspondantes. Le rôle prédéfini Administrateur DNS (`roles/dns.admin`) permet de gérer leurs enregistrements ; un administrateur IAM du projet DNS peut l'accorder au compte Google concerné si nécessaire. Le rôle Administrateur Firebase ne donne pas automatiquement les droits Cloud DNS.

Si le registrar héberge lui-même les DNS ou si la zone n'est pas dans Cloud DNS, la commande affiche les instructions Firebase et les serveurs DNS publics mais n'y applique aucun changement. Ces instructions devront alors être utilisées avec l'outil du fournisseur DNS réel.

Contrôle ultérieur, sans modification :

```bash
pnpm run domaines --status
```

L'état prêt correspond à `HOST_ACTIVE`, `OWNERSHIP_ACTIVE` et un certificat `CERT_ACTIVE` (ou encore valide et proche de son renouvellement). La propagation DNS et l'émission HTTPS ne sont pas instantanées. Les domaines `.dev` exigent HTTPS dans les navigateurs modernes ; attendre que le certificat soit actif pour conclure qu'ils fonctionnent. Les variantes `www` ne sont pas ajoutées implicitement par ce script.

## Coût : distinguer le site, les domaines et les DNS

Il s'agit de Firebase **Hosting classique**. Les domaines personnalisés et les certificats HTTPS standard sont pris en charge par Hosting. Il n'y a pas de serveur dédié à maintenir.

Le coût de Hosting dépend surtout du stockage des versions conservées et des données transférées aux visiteurs. Une version actuellement publiée représente environ **77,5 Mio avant compression**, avec 384 fichiers. Cela ne signifie pas qu'un visiteur télécharge tous ces fichiers : seuls les éléments utilisés sont chargés, avec compression et cache quand c'est applicable.

Repères habituels du plan Blaze, en USD hors taxes, à confirmer dans le [barème officiel Firebase](https://firebase.google.com/pricing) et la console du compte avant toute estimation contractuelle :

| Poste | Franchise de référence | Au-delà |
| --- | --- | --- |
| Stockage Hosting | 10 Go | environ 0,026 USD/Go/mois |
| Transfert Hosting | 10 Go/mois | environ 0,15 USD/Go |

Le plan Spark impose ses quotas gratuits et peut suspendre le service après dépassement ; Blaze permet le dépassement facturé à l'usage. Les quotas gratuits ne se multiplient pas avec les noms de domaine. Les anciennes versions conservées peuvent aussi consommer du stockage.

Exemple purement illustratif : si une première visite transfère 5 Mo, 10 Go représentent de l'ordre de 2 000 premières visites. Ce n'est pas un quota de visiteurs : le poids réel chargé, la navigation et le cache changent le résultat.

L'achat/renouvellement annuel des domaines et, le cas échéant, les zones et requêtes Cloud DNS sont facturés séparément. Les crédits Google Cloud dépendent du compte de facturation, de leur expiration et de leurs conditions d'éligibilité ; ils ne constituent pas un plafond général de dépenses. La commande peut afficher si la facturation Google Cloud est activée, mais elle ne change pas le plan ni le compte de facturation et n'a pas accès au solde des crédits.

Pour suivre la consommation réelle : [Hosting du projet](https://console.firebase.google.com/project/project-c3bfb111-69c7-4d37-9c0/hosting) et [Facturation Google Cloud](https://console.cloud.google.com/billing/linkedaccount?project=project-c3bfb111-69c7-4d37-9c0). Une alerte de budget prévient d'une dépense ; elle ne bloque pas automatiquement les frais.
