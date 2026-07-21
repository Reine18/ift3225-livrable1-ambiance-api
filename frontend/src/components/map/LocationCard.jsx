import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAmbiancePresentation } from "../../utils/ambiancePresentation";

function formatFreshness(updatedAt) {
  if (!updatedAt) {
    return "Aucune mise à jour disponible";
  }

  const updatedDate = new Date(updatedAt);

  if (Number.isNaN(updatedDate.getTime())) {
    return "Date de mise à jour indisponible";
  }

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

function normalizeClassification(ambianceLevel) {
  switch (ambianceLevel) {
    case "calm":
      return "calm";

    case "normal":
      return "moderate";

    case "busy":
    case "noisy":
      return "animated";

    default:
      return "stale";
  }
}

function LocationCard({ location, summary }) {
  const classification = normalizeClassification(
    summary?.ambianceLevel
  );

  const config = getAmbiancePresentation(classification);

  const locationId =
    location.idlocation ?? location.id ?? location._id;

  return (
    <Card className="ambiance-card location-card">
      <Card.Body className="d-flex flex-column p-4">
        <div className="mb-3">
          <p className="small text-secondary mb-1">
            <i
              className="bi bi-geo-alt me-1"
              aria-hidden="true"
            />

            {location.address ??
              `${location.latitude}, ${location.longitude}`}
          </p>

          <Card.Title className="h5 fw-bold mb-0">
            {location.name}
          </Card.Title>
        </div>

        <div
          className={`location-status ${config.statusClass} mb-3`}
        >
          <span aria-hidden="true">{config.icon}</span>
          <span>{config.label}</span>
        </div>

        <p className="location-interpretation mb-3">
          {config.description}
        </p>

        {summary?.averageSoundLevel !== null &&
          summary?.averageSoundLevel !== undefined && (
            <p className="small mb-3">
              Niveau sonore moyen :{" "}
              <strong>
                {summary.averageSoundLevel.toFixed(1)}
              </strong>
            </p>
          )}

        <p className="small text-secondary mb-4">
          <i
            className="bi bi-clock me-1"
            aria-hidden="true"
          />

          {formatFreshness(summary?.latestTimestamp)}
        </p>

        <Button
          as={Link}
          to={`/locations/${locationId}`}
          className="ambiance-btn-primary mt-auto align-self-start"
        >
          Voir le portrait
          <i
            className="bi bi-arrow-right ms-2"
            aria-hidden="true"
          />
        </Button>
      </Card.Body>
    </Card>
  );
}

export default LocationCard;