# Deploy

Manifest Kubernetes e script di deploy per il progetto `liine`.

## Stack

- App Next.js servita come container Node.js standalone
- MongoDB in-cluster (StatefulSet + PVC, provisioner `local-path` di k3s)
- Ingress NGINX con TLS via cert-manager (Let's Encrypt)
- Dominio: `liine.growthsphere.it`

## GitHub Environment Secrets richiesti

Configura questi secret nell'environment GitHub (`production` o quello usato dal workflow CI):

| Secret | Descrizione |
|---|---|
| `GHCR_USERNAME` | Username GitHub per il Container Registry |
| `GHCR_TOKEN` | Personal Access Token con scope `read:packages` e `write:packages` |
| `MONGO_PASSWORD` | Password root di MongoDB. Usa una stringa hex (`openssl rand -hex 32`) per evitare l'URL-encoding nell'URI |
| `ADMIN_PASSWORD` | Password di accesso all'area riservata |
| `SESSION_SECRET` | Stringa random lunga per firmare il token di sessione (`openssl rand -base64 48`) |

`apply-secrets.sh` costruisce da questi valori il Secret `liine-app` (root user di Mongo + `MONGODB_URI`/`ADMIN_PASSWORD`/`SESSION_SECRET`) e il pull secret `ghcr-pull`.

> La `MONGO_PASSWORD` viene applicata alla root di Mongo **solo alla prima
> inizializzazione** (PVC vuoto). Se il volume esiste gia', cambiarla nel secret
> non ha effetto: va cambiata da dentro Mongo con `db.changeUserPassword()`.

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

