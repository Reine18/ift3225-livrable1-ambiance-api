import { MapContainer, TileLayer } from "react-leaflet";

import LocationMarker from "./LocationMarker";

function MapView({ locations }) {
  const defaultCenter = [45.5088, -73.612];

  return (
    <div className="ambiance-map-container">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom
        className="ambiance-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {locations.map((location) => (
  <LocationMarker
    key={
      location.idlocation ??
      location.id ??
      location._id
    }
    location={location}
  />
))}
      </MapContainer>
    </div>
  );
}

export default MapView;