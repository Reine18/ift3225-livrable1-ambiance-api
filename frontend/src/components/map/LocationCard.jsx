import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAmbiancePresentation } from "../../utils/ambiancePresentation";

const classificationConfig = {
  calm: {
    icon: "🌿",
    label: "Calme",
    className: "location-status-calm",
  },
  moderate: {
    icon: "🌤️",
    label: "Modéré",
    className: "location-status-moderate",
  },
  animated: {
    icon: "📣",
    label: "Animé",
    className: "location-status-animated",
  },
  stale: {
    icon: "🕰️",
    label: "Données anciennes",
    className: "location-status-stale",
  },
};

function formatFreshness(updatedAt) {
  const updatedDate = new Date(updatedAt);
  const differenceMs = Date.now() - updatedDate.getTime();
  const differenceMinutes = Math.max(
    0,
    Math.floor(differenceMs / (1000 * 60))
  );

  if (differenceMinutes < 1) {
    return "Mise à jour à l’instant";
  }

  if (differenceMinutes < 60) {
    return `Mise à jour il y a ${differenceMinutes} min`;
  }

  const differenceHours = Math.floor(differenceMinutes / 60);

  if (differenceHours < 24) {
    return `Mise à jour il y a ${differenceHours} h`;
  }

  const differenceDays = Math.floor(differenceHours / 24);
  return `Mise à jour il y a ${differenceDays} j`;
}

function LocationCard({ location }) {
  const config = getAmbiancePresentation(location.classification);

  return (
    <Card className="ambiance-card location-card">
      <Card.Body className="d-flex flex-column p-4">
        <div className="mb-3">
          <p className="small text-secondary mb-1">
            <i className="bi bi-geo-alt me-1" aria-hidden="true" />
            {location.address}
          </p>

          <Card.Title className="h5 fw-bold mb-0">
            {location.name}
          </Card.Title>
        </div>

        <div className={`location-status ${config.statusClass} mb-3`}>
          <span aria-hidden="true">{config.icon}</span>
          <span>{config.label}</span>
        </div>

        <p className="location-interpretation mb-3">
          {config.description}
        </p>

        <p className="small text-secondary mb-4">
          <i className="bi bi-clock me-1" aria-hidden="true" />
          {formatFreshness(location.updatedAt)}
        </p>

        <Button
          as={Link}
          to={`/locations/${location.id}`}
          className="ambiance-btn-primary mt-auto align-self-start"
        >
          Voir le portrait
          <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
        </Button>
      </Card.Body>
    </Card>
  );
}
export default LocationCard;