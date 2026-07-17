import { divIcon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

import { getAmbiancePresentation } from "../../utils/ambiancePresentation";

function LocationMarker({ location }) {
  const config = getAmbiancePresentation(location.classification);

  const customIcon = divIcon({
    className: "ambiance-map-marker-wrapper",
    html: `
      <div class="ambiance-map-marker ${config.markerClass}">
        <span>${config.icon}</span>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -38],
  });

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={customIcon}
    >
      <Popup>
        <div className="ambiance-popup">
          <p className="fw-bold mb-1">
            {location.name}
          </p>

          <p className="small text-secondary mb-2">
            {location.address}
          </p>

          <p className="mb-1 fw-semibold">
            {config.icon} {config.label}
          </p>

          <p className="small text-secondary mb-3">
            {config.description}
          </p>

          <Link
            to={`/locations/${location.id}`}
            className="fw-semibold"
          >
            Voir le portrait
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}

export default LocationMarker;