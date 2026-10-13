
import { useEffect, useRef, useState } from "react";
import { Viewer, Entity, Globe } from "resium";
import { Cartesian3, Color } from "cesium";

const drones = [
  {
    id: "DRONE-01",
    location: "Vijayawada",
    longitude: 80.648,
    latitude: 16.506,
    color: Color.LIME,
    moving: true,
  },
  {
    id: "DRONE-02",
    location: "Guntur",
    longitude: 80.4365,
    latitude: 16.3067,
    color: Color.DODGERBLUE,
    moving: false,
  },
  {
    id: "DRONE-03",
    location: "Tenali",
    longitude: 80.64,
    latitude: 16.243,
    color: Color.ORANGE,
    moving: false,
  },
];

function GlobeView() {
  const viewerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((previous) => (previous + 0.005) % 2);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement;

    if (!viewer) return;

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        80.55,
        16.38,
        45000,
      ),
      duration: 1.5,
    });
  }, []);

  const routeProgress = progress <= 1 ? progress : 2 - progress;

  const movingLongitude =
    80.648 + (80.4365 - 80.648) * routeProgress;

  const movingLatitude =
    16.506 + (16.3067 - 16.506) * routeProgress;

  return (
    <div style={{ height: "420px", width: "100%" }}>
      <Viewer
        ref={viewerRef}
        full={false}
        animation={false}
        timeline={false}
        baseLayerPicker={false}
        geocoder={false}
        homeButton
        sceneModePicker={false}
        navigationHelpButton={false}
        fullscreenButton={false}
        style={{ height: "100%", width: "100%" }}
      >
        <Globe enableLighting />

        {drones.map((drone) => {
          const longitude = drone.moving
            ? movingLongitude
            : drone.longitude;

          const latitude = drone.moving
            ? movingLatitude
            : drone.latitude;

          return (
            <Entity
              key={drone.id}
              name={drone.id}
              description={`Location: ${drone.location}`}
              position={Cartesian3.fromDegrees(
                longitude,
                latitude,
                100,
              )}
              point={{
                pixelSize: drone.moving ? 15 : 12,
                color: drone.color,
                outlineColor: Color.WHITE,
                outlineWidth: 2,
              }}
              label={{
                text: drone.id,
                font: "13px sans-serif",
                fillColor: Color.WHITE,
                showBackground: true,
                backgroundColor:
                  Color.fromCssColorString("#172033"),
                pixelOffset: new Cartesian3(0, -24, 0),
              }}
            />
          );
        })}
      </Viewer>
    </div>
  );
}

export default GlobeView;
