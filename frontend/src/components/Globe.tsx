import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import type { Drone } from '../types';

type GlobeProps = {
  drones: Drone[];
  selectedDrone: Drone;
  onSelect: (droneId: string) => void;
};

export function Globe({ drones, selectedDrone, onSelect }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const entityMap = useRef(new Map<string, Cesium.Entity>());

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const viewer = new Cesium.Viewer(containerRef.current, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      navigationHelpButton: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      terrainProvider: new Cesium.EllipsoidTerrainProvider(),
      baseLayer: false,
    });
    viewer.scene.globe.showGroundAtmosphere = true;
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#0b141e');
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(15, 20, 18500000),
    });
    viewer.selectedEntityChanged.addEventListener((entity) => {
      const droneId = entity?.properties?.droneId?.getValue(Cesium.JulianDate.now());
      if (droneId) onSelect(droneId);
    });

    drones.forEach((drone) => {
      const entity = viewer.entities.add({
        id: drone.id,
        position: Cesium.Cartesian3.fromDegrees(drone.longitude, drone.latitude, drone.altitude),
        point: {
          color: Cesium.Color.fromCssColorString('#f6b94b'),
          outlineColor: Cesium.Color.fromCssColorString('#fff4d6'),
          outlineWidth: 2,
          pixelSize: 12,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
        label: {
          text: drone.id,
          font: '600 12px Sora, sans-serif',
          fillColor: Cesium.Color.WHITE,
          style: Cesium.LabelStyle.FILL,
          pixelOffset: new Cesium.Cartesian2(0, -22),
          showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString('#101923cc'),
          backgroundPadding: new Cesium.Cartesian2(8, 5),
        },
        properties: { droneId: drone.id },
      });
      entityMap.current.set(drone.id, entity);
    });
    viewerRef.current = viewer;

    return () => {
      entityMap.current.clear();
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [drones, onSelect]);

  useEffect(() => {
    const entity = entityMap.current.get(selectedDrone.id);
    if (entity && viewerRef.current) {
      viewerRef.current.selectedEntity = entity;
    }
  }, [selectedDrone]);

  return <div className="globe-shell" ref={containerRef} aria-label="Interactive 3D Earth with simulated drone locations" />;
}
