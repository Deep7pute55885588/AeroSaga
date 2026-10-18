import { useState } from 'react';
import { Activity, ChevronRight, Crosshair, Gauge, Radio, Rocket, ShieldCheck, Wifi } from 'lucide-react';
import { Globe } from './components/Globe';
import { simulateTakeoff } from './services/missionApi';
import type { Drone, TakeoffResponse } from './types';

const drones: Drone[] = [
  { id: 'DRONE-001', latitude: 40.7128, longitude: -74.006, altitude: 120, status: 'SIMULATED / READY' },
  { id: 'DRONE-002', latitude: 51.5072, longitude: -0.1276, altitude: 120, status: 'SIMULATED / READY' },
  { id: 'DRONE-003', latitude: 35.6762, longitude: 139.6503, altitude: 120, status: 'SIMULATED / READY' },
];

function App() {
  const [selectedId, setSelectedId] = useState(drones[0].id);
  const [response, setResponse] = useState<TakeoffResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const selectedDrone = drones.find((drone) => drone.id === selectedId) ?? drones[0];

  async function handleTakeoff() {
    setIsLaunching(true);
    setError(null);
    setResponse(null);
    try {
      setResponse(await simulateTakeoff(selectedDrone.id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The backend is unavailable.');
    } finally {
      setIsLaunching(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark"><Crosshair size={22} /></div><div><strong>AeroSaga</strong><span>DRONE MISSION CONTROL</span></div></div>
        <div className="system-state"><span className="live-dot" /> LOCAL SIMULATION <span className="divider" /> <Wifi size={15} /> TEMPORAL LINK READY</div>
      </header>

      <section className="intro-row">
        <div><p className="eyebrow">FLIGHT OPERATIONS / WEEK 01</p><h1>Mission overview</h1><p className="muted">A clear view of the simulated fleet and its command state.</p></div>
        <div className="utc-clock"><span>CONTROL WINDOW</span><strong>STATIC SIMULATION</strong></div>
      </section>

      <section className="metrics-grid" aria-label="Fleet summary">
        <article className="metric"><div className="metric-icon gold"><Radio size={18} /></div><div><span>Configured drones</span><strong>{drones.length.toString().padStart(2, '0')}</strong></div></article>
        <article className="metric"><div className="metric-icon mint"><ShieldCheck size={18} /></div><div><span>Fleet readiness</span><strong>100%</strong></div></article>
        <article className="metric"><div className="metric-icon blue"><Activity size={18} /></div><div><span>Active workflows</span><strong>{response ? '01' : '00'}</strong></div></article>
        <article className="metric"><div className="metric-icon coral"><Gauge size={18} /></div><div><span>Operating mode</span><strong className="metric-text">SIMULATED</strong></div></article>
      </section>

      <section className="command-grid">
        <div className="map-panel panel"><div className="panel-heading"><div><span className="section-kicker">GLOBAL VIEW</span><h2>Fleet positions</h2></div><span className="map-note"><span className="live-dot" /> LIVE MAP FEED</span></div><Globe drones={drones} selectedDrone={selectedDrone} onSelect={setSelectedId} /><div className="map-footer"><span><span className="legend-dot drone" /> Simulated drone</span><span>Drag to rotate · Scroll to zoom</span></div></div>
        <aside className="side-column">
          <div className="panel fleet-panel"><div className="panel-heading"><div><span className="section-kicker">AIRCRAFT</span><h2>Configured fleet</h2></div><span className="count-badge">03</span></div><div className="drone-list">{drones.map((drone) => <button className={`drone-row ${drone.id === selectedId ? 'selected' : ''}`} key={drone.id} onClick={() => setSelectedId(drone.id)}><span className="drone-avatar"><Crosshair size={16} /></span><span className="drone-copy"><strong>{drone.id}</strong><small><span className="status-dot" /> {drone.status}</small></span><ChevronRight size={16} /></button>)}</div></div>
          <div className="panel detail-panel"><div className="panel-heading"><div><span className="section-kicker">SELECTED UNIT</span><h2>{selectedDrone.id}</h2></div><span className="ready-badge">READY</span></div><div className="coordinates"><div><span>LATITUDE</span><strong>{selectedDrone.latitude.toFixed(4)}°</strong></div><div><span>LONGITUDE</span><strong>{selectedDrone.longitude.toFixed(4)}°</strong></div><div><span>ALTITUDE</span><strong>{selectedDrone.altitude} m</strong></div></div><button className="takeoff-button" disabled={isLaunching} onClick={handleTakeoff}><Rocket size={17} /> {isLaunching ? 'CONTACTING TEMPORAL...' : 'SIMULATE TAKEOFF'}</button>{response && <div className="feedback success"><ShieldCheck size={16} /><div><strong>{response.status}</strong><span>{response.message}</span><small>Workflow {response.workflowId}</small></div></div>}{error && <div className="feedback failure"><Radio size={16} /><div><strong>BACKEND UNAVAILABLE</strong><span>{error}</span></div></div>}</div>
        </aside>
      </section>
      <footer><span>AEROSAGA SYSTEMS / WEEK 1 FOUNDATION</span><span>NO REAL AIRCRAFT CONNECTED</span></footer>
    </main>
  );
}

export default App;
