# Peerceptiv-Phase3-Assignment3

The purpose of this repo is to demonstrate competence with Docker containerization, AWS cloud services, and Kubernetes orchestration.

## Setup (Docker Compose)

### Prerequisites

- Docker Engine or Docker Desktop installed
- Docker Compose v2 available (`docker compose version`)

### 1) Clone and open the project

```bash
git clone https://github.com/iltStudent07/Peerceptiv-Phase3-Assignment3.git
cd Peerceptiv-Phase3-Assignment3
```

### 2) Build and start all services

```bash
docker compose up --build -d
```

This starts:

- `mongo` (MongoDB)
- `api` (Express API on port `4000`)
- `client` (React app served by Nginx on port `3000`)

### 3) Verify containers are healthy

```bash
docker compose ps
```

Expected:

- `mongo` should be `healthy`
- `api` should be `healthy`
- `client` should be `Up`

### 4) Open the app and test API

- Frontend: `http://localhost:3000`
- API health: `http://localhost:4000/health`

Optional CLI check:

```bash
curl http://localhost:4000/health
```

### 5) View logs (if needed)

```bash
docker compose logs -f
```

Or service-specific logs:

```bash
docker compose logs -f api
docker compose logs -f client
docker compose logs -f mongo
```

### 6) Stop services

```bash
docker compose down
```

To also remove Mongo data volume:

```bash
docker compose down -v
```

### Rebuild from scratch

```bash
docker compose down -v
docker compose up --build -d
```

## Kubernetes (Kind, Local Image)

This project uses a local image reference in `api-deployment.yml`:

- `image: express-api:local`

Build and load it into Kind before applying manifests:

```bash
docker build -t express-api:local ./api
kind load docker-image express-api:local
kubectl apply -f mongo-deployment.yml
kubectl apply -f api-deployment.yml
kubectl get deploy,pods,svc
```

Access the API (works on any Kind setup):

```bash
kubectl port-forward service/express-api-svc 8080:80
curl http://localhost:8080/health
```

## Repo Author
iltStudent07