import { Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

import AmbianceBadge from "../components/ambiance/AmbianceBadge";
import SummaryCard from "../components/ambiance/SummaryCard";
import EmptyState from "../components/feedback/EmptyState";
import { getAmbiancePresentation } from "../utils/ambiancePresentation";
import { mockLocationDetails } from "../utils/mockLocationDetails";
import SoundChart from "../components/ambiance/SoundChart";
import ObservationCard from "../components/ambiance/ObservationCard";
import QuietHoursTable from "../components/ambiance/QuietHoursTable";

function formatUpdatedAt(updatedAt) {
  const differenceMinutes = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(updatedAt).getTime()) / 60000
    )
  );

  if (differenceMinutes < 1) {
    return "Mise à jour à l’instant";
  }

  if (differenceMinutes < 60) {
    return `Mise à jour il y a ${differenceMinutes} min`;
  }

  const differenceHours = Math.floor(differenceMinutes / 60);
  return `Mise à jour il y a ${differenceHours} h`;
}

function LocationDetailsPage() {
  const { locationId } = useParams();
  const location = mockLocationDetails[locationId];

  if (!location) {
    return (
      <Container className="py-5">
        <EmptyState
          title="Lieu introuvable"
          message="Le lieu demandé n’existe pas ou n’est plus disponible."
        />
      </Container>
    );
  }

  const presentation = getAmbiancePresentation(
    location.classification
  );

  return (
    <div className="location-details-page">
      <section className="location-details-header">
        <Container>
          <Link to="/" className="location-back-link">
            <i
              className="bi bi-arrow-left me-2"
              aria-hidden="true"
            />
            Retour à la carte
          </Link>

          <div className="location-heading mt-4">
            <div>
              <p className="small text-secondary mb-2">
                <i
                  className="bi bi-geo-alt me-1"
                  aria-hidden="true"
                />
                {location.address}
              </p>

              <h1 className="display-5 fw-bold mb-3">
                {location.name}
              </h1>

              <div className="d-flex flex-wrap align-items-center gap-3">
                <AmbianceBadge
                  classification={location.classification}
                  size="large"
                />

                <span className="text-secondary">
                  <i
                    className="bi bi-clock me-1"
                    aria-hidden="true"
                  />
                  {formatUpdatedAt(location.updatedAt)}
                </span>
              </div>
            </div>

            <div
              className={`location-interpretation-panel ${presentation.statusClass}`}
            >
              <span
                className="location-interpretation-icon"
                aria-hidden="true"
              >
                {presentation.icon}
              </span>

              <div>
                <p className="fw-bold mb-1">
                  {presentation.label}
                </p>

                <p className="mb-0">
                  {presentation.description}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="ambiance-section">
        <Container>
          <div className="mb-4">
            <h2 className="ambiance-section-title">
              Portrait actuel
            </h2>

            <p className="ambiance-section-description">
              Résumé des données disponibles pour ce lieu.
            </p>
          </div>

          <Row className="g-4">
            <Col xs={12} md={4}>
              <SummaryCard
                icon="bi-soundwave"
                label="Niveau sonore moyen"
                value={location.averageSoundLevel.toFixed(2)}
                description="Valeur non calibrée fournie par Phyphox"
              />
            </Col>

            <Col xs={12} md={4}>
              <SummaryCard
                icon="bi-activity"
                label="Mesures collectées"
                value={location.measurementsCount}
                description="Mesures enregistrées pour ce lieu"
              />
            </Col>

            <Col xs={12} md={4}>
              <SummaryCard
                icon="bi-chat-left-text"
                label="Observations"
                value={location.observationsCount}
                description="Contributions environnementales"
              />
            </Col>
          </Row>

          <div className="mt-5">
            <SoundChart data={location.history} />
          </div>

          <div className="mt-4">
            <QuietHoursTable data={location.quietHours} />
          </div>

          <div className="mt-4">
            <ObservationCard observation={location.latestObservation} />
          </div>
        </Container>
      </section>
    </div>
  );
}

export default LocationDetailsPage;