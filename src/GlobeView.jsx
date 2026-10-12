
import { useEffect, useRef } from "react";
import {
  Viewer,
  Entity,
  Camera,
  Globe,
} from "resium";
import {
  Cartesian3,
  Color,
  createWorldTerrainAsync,
} from "cesium";

const drones = [
  {
    id: "DRONE-01",
    location: "Vijayawada",
    longitude: 80.648,
    latitude: 16.506,
    color: Color.LIME,
  },
  {
    id: "DRONE-02",
    location: "Guntur",
    longitude: 80.4365,
    latitude: 16.3067,
    color: Color.DODGERBLUE,
  },
  {
    id: "DRONE-03",
    location: "Tenali",
    longitude: 80.64,
    latitude: 16.243,
    color: Color.ORANGE,
  },
];

function GlobeView() {
  const viewerRef = useRef(null);

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

  return (
    <div style={{ height: "420px", width: "100%" }}>
      <Viewer
        ref={viewerRef}
        full={false}
        animation={false}
        timeline={false}
        baseLayerPicker={false}
        geocoder={false}
        homeButton={true}
        sceneModePicker={false}
        navigationHelpButton={false}
        fullscreenButton={false}
        style={{ height: "100%", width: "100%" }}
      >
        <Globe enableLighting />

        {drones.map((drone) => (
          <Entity
            key={drone.id}
            name={drone.id}
            description={`Status location: ${drone.location}`}
            position={Cartesian3.fromDegrees(
              drone.longitude,
              drone.latitude,
              100,
            )}
            point={{
              pixelSize: 12,
              color: drone.color,
              outlineColor: Color.WHITE,
              outlineWidth: 2,
            }}
            label={{
              text: drone.id,
              font: "13px sans-serif",
              fillColor: Color.WHITE,
              showBackground: true,
              backgroundColor: Color.fromCssColorString(
                "#172033",
              ),
              pixelOffset: new Cartesian3(0, -24, 0),
            }}
          />
        ))}
      </Viewer>
    </div>
  );
}

export default GlobeView;
