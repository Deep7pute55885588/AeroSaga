export type Drone = {
  id: string;
  latitude: number;
  longitude: number;
  altitude: number;
  status: 'SIMULATED / READY';
};

export type TakeoffResponse = {
  workflowId: string;
  droneId: string;
  status: string;
  message: string;
  completedAt: string;
};
