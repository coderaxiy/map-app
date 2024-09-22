import { useEffect, useState, useRef } from "react";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import Overlay from "ol/Overlay";
import "ol/ol.css";
import marker from "./assets/inactiveMarker.svg";
import data from "./data.json";
import { Button, Modal } from "antd";
import uuid from "react-uuid";
import DetailForm from "./DetailForm";

export type coordinateTypes = {
  id: string;
  latitude: number;
  longitude: number;
  status: boolean;
  details: string;
};

export default function OpenLayersMap() {
  const coords = data.coordinates.map((v) => ({ id: uuid(), ...v }));
  const [coordinates, setCoordinates] = useState<coordinateTypes[]>(coords);
  const [selected, setSelected] = useState<coordinateTypes | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false)
  const mapRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  function outsideDetector(event: MouseEvent) {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      const markerElement = (event.target as HTMLElement).closest('.ol-marker');
      if (!markerElement) {
        setSelected(null);
      }
    }
  }

  useEffect(() => {
    if (selected) {
      document.addEventListener('mousedown', outsideDetector);
      return () => {
        document.removeEventListener('mousedown', outsideDetector);
      };
    }
  }, [selected]);

  const activeIcon = new Icon({
    src: marker,
    size: [50, 50],
    scale: 1,
  });

  const inActiveIcon = new Icon({
    src: marker,
    size: [50, 50],
    color: '#212121',
    scale: 1,
  });


  useEffect(() => {
    const savedData = localStorage.getItem("coordinates");
    if (savedData) {
      setCoordinates(JSON.parse(savedData));
    } else {
      localStorage.setItem("coordinates", JSON.stringify(coordinates));
    }
  }, [])

  useEffect(() => {
    const initialMap = new Map({
      target: mapRef.current!,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([coordinates[0].longitude, coordinates[0].latitude]),
        zoom: 6,
      }),
    });
    
    const popup = new Overlay({
      element: popupRef.current!,
      autoPan: true,
    });
    initialMap.addOverlay(popup);

    const vectorSource = new VectorSource();
    coordinates.forEach((item) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([item.longitude, item.latitude])),
        item,
      });

      feature.setStyle(
        new Style({
          image: item.status ? activeIcon : inActiveIcon
        })
      );

      feature?.getStyle()?.getImage()?.getAnchor();
      const element = feature.getGeometry();
      element?.set('className', 'ol-marker');

      vectorSource.addFeature(feature);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    initialMap.addLayer(vectorLayer);

    initialMap.on("click", function (event) {
      initialMap.forEachFeatureAtPixel(event.pixel, function (feature) {
        const item = feature.get("item") as coordinateTypes;
        setSelected(item);
        popup.setPosition(event.coordinate);
      });
    });

    return () => initialMap.setTarget(undefined);
  }, [coordinates]);

  const closeModal = () => setOpenModal(false);

  return (
    <>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100vh" }}
      />

      <div ref={popupRef} className="ol-popup">
        <div className="ol-popup-content bg-white p-4">
          {selected && (
            <ul>
              <li className="flex items-center gap-2 text-sm font-medium">
                Status:{" "}
                <h3 className="text-xs font-medium">
                  {selected.status ? "active" : "inactive"}
                </h3>
              </li>
              <li className="flex items-center gap-2 text-sm font-medium">
                Comment:{" "}
                <h3 className="text-xs font-medium">{selected.details}</h3>
              </li>
            </ul>
          )}
          {selected && (
            <Button
              className="mt-2"
              htmlType="button"
              type="primary"
              onClick={() => setOpenModal(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <Modal open={openModal} onCancel={closeModal} footer={null}>
          <DetailForm
            item={selected}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            closeModal={closeModal}
          />
      </Modal>
    </>
  );
}
