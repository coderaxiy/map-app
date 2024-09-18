import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useState, useEffect } from "react";
import inactive from "./assets/inactiveMarker.svg";
import active from "./assets/activeMarker.svg";
import data from "./data.json";
import "leaflet.offline";
import DetailForm from "./DetailForm";
import { Button, Modal } from "antd";
import uuid from "react-uuid";

export type coordinateTypes = {
  id: string;
  latitude: number;
  longitude: number;
  status: boolean;
  details: string;
};

export default function LeafletMap() {
  const coords = data.coordinates.map((v) => ({ id: uuid(), ...v }));
  const [coordinates, setCoordinates] = useState<coordinateTypes[]>(coords);
  const [selected, setSelected] = useState<coordinateTypes | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("coordinates");
    if (savedData) {
      setCoordinates(JSON.parse(savedData));
    } else {
      localStorage.setItem("coordinates", JSON.stringify(coordinates));
    }
  }, []);

  const closeModal = () => setSelected(null);

  const activeIcon = L.icon({
    iconUrl: active,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
  });

  const inActiveIcon = L.icon({
    iconUrl: inactive,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
  });

  return (
    <>
      <MapContainer
        center={[coordinates[0].latitude, coordinates[0].longitude]}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinates.map((item) => (
          <Marker
            icon={item.status ? activeIcon : inActiveIcon}
            key={item.latitude}
            position={[item.latitude, item.longitude]}
          >
            <Popup>
              <ul>
                <li className="flex items-center gap-2 text-sm font-medium">
                  Status:{" "}
                  <h3 className="text-xs font-medium">
                    {item.status ? "active" : "inactive"}
                  </h3>
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  Comment:{" "}
                  <h3 className="text-xs font-medium">{item.details}</h3>
                </li>
              </ul>
              <Button
                className="mt-2"
                htmlType="button"
                type="primary"
                onClick={() => setSelected(item)}
              >
                Edit
              </Button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <Modal open={selected !== null} onCancel={closeModal} footer={null}>
        {selected && (
          <DetailForm
            item={selected}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            closeModal={closeModal}
          />
        )}
      </Modal>
    </>
  );
}
