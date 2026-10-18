import type { TakeoffResponse } from '../types';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export async function simulateTakeoff(droneId: string): Promise<TakeoffResponse> {
  const response = await fetch(`${apiBaseUrl}/api/missions/takeoff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ droneId }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message ?? 'The backend could not start the Temporal workflow.');
  }
  return payload as TakeoffResponse;
}
