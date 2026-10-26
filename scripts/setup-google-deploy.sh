#!/usr/bin/env bash
set -euo pipefail

# One-time setup, run locally by the Google project owner after Firebase setup.
# GitHub uses short-lived Google credentials; no service-account key is created.
for portfolio_tool in gcloud gh; do
  if ! command -v "$portfolio_tool" >/dev/null 2>&1; then
    echo "Installe ${portfolio_tool} avant de continuer (voir docs/firebase-hosting.md)." >&2
    exit 1
  fi
done

PORTFOLIO_PROJECT_ID="project-c3bfb111-69c7-4d37-9c0"
PORTFOLIO_REPOSITORY="antoinebrnl/Portfolio-Antoine-BrnL"
PORTFOLIO_POOL="portfolio-github"
PORTFOLIO_PROVIDER="github-main"
PORTFOLIO_SERVICE_ACCOUNT="portfolio-deploy@${PORTFOLIO_PROJECT_ID}.iam.gserviceaccount.com"

if [[ -z "$(gcloud auth list --filter=status:ACTIVE --format='value(account)')" ]]; then
  gcloud auth login
fi
if ! gh auth status --hostname github.com >/dev/null 2>&1; then
  gh auth login --hostname github.com --git-protocol https --web
fi

PORTFOLIO_PROJECT_NUMBER="$(gcloud projects describe "$PORTFOLIO_PROJECT_ID" --format='value(projectNumber)')"
PORTFOLIO_REPOSITORY_ID="$(gh api "repos/${PORTFOLIO_REPOSITORY}" --jq '.id')"
PORTFOLIO_OWNER_ID="$(gh api "repos/${PORTFOLIO_REPOSITORY}" --jq '.owner.id')"
if [[ ! "$PORTFOLIO_PROJECT_NUMBER" =~ ^[0-9]+$ || ! "$PORTFOLIO_REPOSITORY_ID" =~ ^[0-9]+$ || ! "$PORTFOLIO_OWNER_ID" =~ ^[0-9]+$ ]]; then
  echo "Impossible de vérifier l'identité du projet Google ou du dépôt GitHub." >&2
  exit 1
fi

gcloud services enable iam.googleapis.com iamcredentials.googleapis.com sts.googleapis.com --project="$PORTFOLIO_PROJECT_ID" --quiet

if ! gcloud iam service-accounts describe "$PORTFOLIO_SERVICE_ACCOUNT" --project="$PORTFOLIO_PROJECT_ID" >/dev/null 2>&1; then
  gcloud iam service-accounts create portfolio-deploy --display-name="Publication du portfolio Antoine BrnL" --project="$PORTFOLIO_PROJECT_ID" --quiet
fi
for portfolio_role in roles/firebasehosting.admin roles/serviceusage.serviceUsageConsumer; do
  gcloud projects add-iam-policy-binding "$PORTFOLIO_PROJECT_ID" --member="serviceAccount:${PORTFOLIO_SERVICE_ACCOUNT}" --role="$portfolio_role" --condition=None --quiet --format=none
done

if ! gcloud iam workload-identity-pools describe "$PORTFOLIO_POOL" --location=global --project="$PORTFOLIO_PROJECT_ID" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools create "$PORTFOLIO_POOL" --location=global --display-name="GitHub du portfolio" --project="$PORTFOLIO_PROJECT_ID" --quiet
fi
PORTFOLIO_TRUST_CONDITION="assertion.repository_id == '${PORTFOLIO_REPOSITORY_ID}' && assertion.repository_owner_id == '${PORTFOLIO_OWNER_ID}' && assertion.ref == 'refs/heads/main'"
if gcloud iam workload-identity-pools providers describe "$PORTFOLIO_PROVIDER" --workload-identity-pool="$PORTFOLIO_POOL" --location=global --project="$PORTFOLIO_PROJECT_ID" >/dev/null 2>&1; then
  PORTFOLIO_PROVIDER_COMMAND="update-oidc"
else
  PORTFOLIO_PROVIDER_COMMAND="create-oidc"
fi
gcloud iam workload-identity-pools providers "$PORTFOLIO_PROVIDER_COMMAND" "$PORTFOLIO_PROVIDER" \
  --workload-identity-pool="$PORTFOLIO_POOL" --location=global --project="$PORTFOLIO_PROJECT_ID" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository_id=assertion.repository_id" \
  --attribute-condition="$PORTFOLIO_TRUST_CONDITION" --quiet

gcloud iam service-accounts add-iam-policy-binding "$PORTFOLIO_SERVICE_ACCOUNT" \
  --project="$PORTFOLIO_PROJECT_ID" --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/${PORTFOLIO_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${PORTFOLIO_POOL}/attribute.repository_id/${PORTFOLIO_REPOSITORY_ID}" \
  --quiet --format=none

gh variable set GCP_SERVICE_ACCOUNT --repo "$PORTFOLIO_REPOSITORY" --body "$PORTFOLIO_SERVICE_ACCOUNT"
gh variable set GCP_WORKLOAD_IDENTITY_PROVIDER --repo "$PORTFOLIO_REPOSITORY" \
  --body "projects/${PORTFOLIO_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${PORTFOLIO_POOL}/providers/${PORTFOLIO_PROVIDER}"
gh workflow run firebase-hosting.yml --repo "$PORTFOLIO_REPOSITORY" --ref main
echo "Publication automatique activée pour la branche main. Consulte l'onglet Actions du dépôt GitHub."
