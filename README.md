# AeroSaga

AeroSaga is a Week 1 drone mission-control foundation. It runs a real local Temporal workflow for a simulated takeoff and presents a static fleet on an interactive CesiumJS globe.

## Week 1 scope

- A Spring Boot REST API starts a Temporal workflow.
- The workflow invokes a registered `Takeoff` activity.
- The activity returns a simulated result; no real aircraft is connected.
- A Vite React dashboard shows three static drone positions.
- Cesium uses a local ellipsoid globe, so an Ion token is not required.

## Architecture

`frontend` calls `backend` over REST. The backend starts `DroneMissionWorkflow` on the configured Temporal task queue. The Temporal worker registers `DroneMissionWorkflowImpl` and `DroneActivitiesImpl`; external operations stay in the activity layer.

## Prerequisites

- Java 17 or newer
- Maven 3.9 or newer
- Node.js 20 or newer and npm
- Docker Desktop running

Check tools in PowerShell:

```powershell
java -version
mvn -version
node --version
npm --version
docker version
```

## Run Temporal

From the repository root:

```powershell
docker compose up -d
docker compose ps
```

The Temporal service listens on `127.0.0.1:7233`; the Web UI is at <http://localhost:8233>. Stop it with `docker compose down`.

## Run the backend

```powershell
cd backend
mvn spring-boot:run
```

Configuration is in `backend/src/main/resources/application.yml` and can be overridden with `TEMPORAL_SERVICE_ADDRESS`, `TEMPORAL_NAMESPACE`, `TEMPORAL_TASK_QUEUE`, `SERVER_PORT`, and `FRONTEND_ORIGIN`.

The API listens on `http://localhost:8080`.

### REST endpoints

Start a simulated takeoff:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/missions/takeoff -ContentType 'application/json' -Body '{"droneId":"DRONE-001"}'
```

Check a completed workflow by replacing the ID:

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:8080/api/missions/takeoff/{workflowId}
```

The start response includes the Temporal workflow ID, `COMPLETED` status, and the activity result, for example: `Drone DRONE-001 takeoff simulated successfully`.

## Run the frontend

In a second PowerShell window:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally <http://localhost:5173>. Set `VITE_API_BASE_URL` when the API runs elsewhere. `npm run lint` runs TypeScript validation and `npm run build` creates the production bundle.

## Cesium token note

The Week 1 viewer uses Cesium's local ellipsoid terrain and no online imagery, so no access token or secret is needed. If a future week adds Cesium Ion imagery or terrain, provide `VITE_CESIUM_ION_TOKEN` through an uncommitted `.env.local` file and never commit it.

## Troubleshooting

- If the backend cannot connect, confirm `docker compose ps` shows Temporal running and that port 7233 is free.
- If the browser reports CORS errors, ensure the frontend URL matches `FRONTEND_ORIGIN`.
- If the globe is blank after dependency installation, stop and restart Vite; Cesium assets are loaded from the installed package.
- Use `docker compose logs temporal` to inspect the local Temporal service.

## Deferred work

Live GPS/WebSockets, navigation, package drops, return-to-base, multi-drone orchestration, compensation, authentication, persistence, emergency aborts, real hardware, and cloud deployment are intentionally deferred beyond Week 1.
