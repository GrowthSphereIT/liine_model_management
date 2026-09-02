# Deploy

Manifest Kubernetes e script di deploy per il progetto `liine`.

## Stack

- App Next.js servita come container Node.js standalone
- MongoDB in-cluster (StatefulSet + PVC, provisioner `local-path` di k3s)
- Ingress NGINX con TLS via cert-manager (Let's Encrypt)
- Dominio: `www.liinemodelmanagement.com` (apex `liinemodelmanagement.com` reindirizzato a www)

## GitHub Environment Secrets richiesti

Configura questi secret nell'environment GitHub (`production` o quello usato dal workflow CI):

| Secret | Descrizione |
|---|---|
| `GHCR_USERNAME` | Username GitHub per il Container Registry |
| `GHCR_TOKEN` | Personal Access Token con scope `read:packages` e `write:packages` |
| `MONGO_PASSWORD` | Password root di MongoDB. Usa una stringa hex (`openssl rand -hex 32`) per evitare l'URL-encoding nell'URI |
| `ADMIN_PASSWORD` | Password di accesso all'area riservata |
| `SESSION_SECRET` | Stringa random lunga per firmare il token di sessione (`openssl rand -base64 48`) |
| `MINIO_ROOT_USER` | Access key root di MinIO (riusata dall'app come `S3_ACCESS_KEY`). Es. `liine` o una stringa hex |
| `MINIO_ROOT_PASSWORD` | Secret key root di MinIO (riusata come `S3_SECRET_KEY`). Usa `openssl rand -hex 32` |

`apply-secrets.sh` costruisce da questi valori il Secret `liine-app` (root user di Mongo + `MONGODB_URI`/`ADMIN_PASSWORD`/`SESSION_SECRET` + credenziali MinIO `MINIO_ROOT_*` e `S3_ACCESS_KEY`/`S3_SECRET_KEY`) e il pull secret `ghcr-pull`.

> La `MONGO_PASSWORD` viene applicata alla root di Mongo **solo alla prima
> inizializzazione** (PVC vuoto). Se il volume esiste gia', cambiarla nel secret
> non ha effetto: va cambiata da dentro Mongo con `db.changeUserPassword()`.

> Stesso vincolo per `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD`: valgono **solo al
> primo avvio** di MinIO (PVC vuoto). Su un volume esistente vanno ruotate da
> dentro MinIO (`mc admin user`), non cambiando il secret.

Le foto dei composit sono salvate su MinIO (bucket `liine`, creato in automatico
al primo upload); i record dei composit stanno su MongoDB.

## Deploy

```bash
# 1. Applica il secret GHCR (una tantum o quando cambia il token)
bash deploy/scripts/apply-secrets.sh

# 2. Applica i manifest
kubectl apply -k deploy/k8s/overlays/prod
kubectl -n liine rollout status deploy/liine
```

## Image

L'immagine � pubblicata su GHCR:

```
ghcr.io/codesphereit/liine:<tag>
```

Il CI aggiorna il tag via `kustomize edit set image` prima dell'apply.

