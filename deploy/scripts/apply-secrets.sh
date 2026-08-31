#!/usr/bin/env bash
# Create or update the Kubernetes Secrets used by liine, sourcing values from
# environment variables (which CI wires up from GitHub environment secrets).
#
# Required env vars:
#   GHCR_USERNAME    GitHub Container Registry username
#   GHCR_TOKEN       GitHub Container Registry token (PAT with read:packages)
#   MONGO_PASSWORD   MongoDB root password (use a hex string, e.g. `openssl rand -hex 32`,
#                    so it needs no URL-encoding inside MONGODB_URI)
#   ADMIN_PASSWORD   Password for the reserved area login
#   SESSION_SECRET   Long random string signing the session token
#   MINIO_ROOT_USER      MinIO root access key (also used as the app's S3_ACCESS_KEY)
#   MINIO_ROOT_PASSWORD  MinIO root secret key (also used as the app's S3_SECRET_KEY)
#
# Optional:
#   NAMESPACE        (default: liine)
#   MONGO_USERNAME   (default: liine)
#   MONGO_DB         (default: liine)
#
# Usage: bash deploy/scripts/apply-secrets.sh
set -euo pipefail

NAMESPACE="${NAMESPACE:-liine}"
MONGO_USERNAME="${MONGO_USERNAME:-liine}"
MONGO_DB="${MONGO_DB:-liine}"

: "${GHCR_USERNAME:?GHCR_USERNAME is required}"
: "${GHCR_TOKEN:?GHCR_TOKEN is required}"
: "${MONGO_PASSWORD:?MONGO_PASSWORD is required}"
: "${ADMIN_PASSWORD:?ADMIN_PASSWORD is required}"
: "${SESSION_SECRET:?SESSION_SECRET is required}"
: "${MINIO_ROOT_USER:?MINIO_ROOT_USER is required}"
: "${MINIO_ROOT_PASSWORD:?MINIO_ROOT_PASSWORD is required}"

# The app reaches Mongo via the in-cluster headless Service `mongo`.
MONGODB_URI="mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo.${NAMESPACE}.svc.cluster.local:27017/${MONGO_DB}?authSource=admin"

kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

# GHCR pull secret (used by the Deployment's imagePullSecrets).
kubectl create secret docker-registry ghcr-pull \
  --namespace "$NAMESPACE" \
  --docker-server=ghcr.io \
  --docker-username="$GHCR_USERNAME" \
  --docker-password="$GHCR_TOKEN" \
  --dry-run=client -o yaml | kubectl apply -f -

# App + MongoDB credentials. MONGO_INITDB_ROOT_* seed the Mongo root user on
# first boot; MONGODB_URI/ADMIN_PASSWORD/SESSION_SECRET are consumed by the web
# Deployment.
kubectl create secret generic liine-app \
  --namespace "$NAMESPACE" \
  --from-literal=MONGO_INITDB_ROOT_USERNAME="$MONGO_USERNAME" \
  --from-literal=MONGO_INITDB_ROOT_PASSWORD="$MONGO_PASSWORD" \
  --from-literal=MONGODB_URI="$MONGODB_URI" \
  --from-literal=ADMIN_PASSWORD="$ADMIN_PASSWORD" \
  --from-literal=SESSION_SECRET="$SESSION_SECRET" \
  --from-literal=MINIO_ROOT_USER="$MINIO_ROOT_USER" \
  --from-literal=MINIO_ROOT_PASSWORD="$MINIO_ROOT_PASSWORD" \
  --from-literal=S3_ACCESS_KEY="$MINIO_ROOT_USER" \
  --from-literal=S3_SECRET_KEY="$MINIO_ROOT_PASSWORD" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Secrets applied in namespace '$NAMESPACE'."
