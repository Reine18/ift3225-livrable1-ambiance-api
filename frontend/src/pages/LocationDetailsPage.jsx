import { Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

import AmbianceBadge from "../components/ambiance/AmbianceBadge";
import FavoriteButton from "../components/favorites/FavoriteButton";
import SummaryCard from "../components/ambiance/SummaryCard";

import SoundChart from "../components/ambiance/SoundChart";
import ObservationCard from "../components/ambiance/ObservationCard";
import QuietHoursTable from "../components/ambiance/QuietHoursTable";

import useLocations from "../hooks/useLocations";
import useLocationDetails from "../hooks/useLocationDetails";
import {
  getAmbiancePresentation,
  normalizeClassification,
} from "../utils/ambiancePresentation";

import Loading from "../components/feedback/Loading";
import Error from "../components/feedback/Error";
import EmptyState from "../components/feedback/EmptyState";

import { formatUpdatedAt } from "../utils/freshness";




function LocationDetailsPage() {
  const { locationId } = useParams();

  const {
    locations,
    isLoading: areLocationsLoading,
    error: locationsError,
  } = useLocations();

  const {
    summary,
    quietHours,
    isLoading: areDetailsLoading,
    error: detailsError,
    reload,
  } = useLocationDetails(locationId);

  const location = locations.find(
    (item) =>
      item.idlocation === locationId ||
      item.id === locationId ||
      item._id === locationId
  );

  const isLoading =
    areLocationsLoading || areDetailsLoading;

  if (isLoading) {
  return (
    <Container className="py-5">
      <Loading message="Chargement du portrait du lieu..." />
    </Container>
  );
}

  if (locationsError) {
    return (
      <Container className="py-5">
        <EmptyState
          title="Impossible de charger les lieux"
          message={locationsError}
        />
      </Container>
    );
  }

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

  if (detailsError || !summary) {
    return (
      <Container className="py-5">
        <EmptyState
          title="Portrait indisponible"
          message={
            detailsError ??
            "Aucune donnée d’ambiance n’est disponible pour ce lieu."
          }
        />

        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={reload}
          >
            Réessayer
          </button>
        </div>
      </Container>
    );
  }

  const classification = normalizeClassification(
    summary.ambianceLevel
  );

  const presentation = 
    getAmbiancePresentation(classification);

  const address =
    location.address ??
    `${location.latitude}, ${location.longitude}`;

  const averageSoundLevel =
    typeof summary.averageSoundLevel === "number"
      ? summary.averageSoundLevel.toFixed(2)
      : "Indisponible";

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
                {address}
              </p>

              <h1 className="display-5 fw-bold mb-3">
                {location.name}
              </h1>

              <div className="d-flex flex-wrap align-items-center gap-3">
                <AmbianceBadge
                  classification={classification}
                  size="large"
                />

                <FavoriteButton locationId={locationId} />

                <span className="text-secondary">
                  <i
                    className="bi bi-clock me-1"
                    aria-hidden="true"
                  />
                  {formatUpdatedAt(
                    summary.latestTimestamp
                  )}
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
                value={averageSoundLevel}
                description="Valeur absolue non calibrée fournie par Phyphox"
              />
            </Col>

            <Col xs={12} md={4}>
              <SummaryCard
                icon="bi-activity"
                label="Mesures collectées"
                value={summary.measurementsCount ?? 0}
                description="Mesures enregistrées pour ce lieu"
              />
            </Col>

            <Col xs={12} md={4}>
              <SummaryCard
                icon="bi-chat-left-text"
                label="Observations"
                value={summary.observationsCount ?? 0}
                description="Contributions environnementales"
              />
            </Col>
          </Row>

          <div className="mt-5">
            <SoundChart data={quietHours ?? []} />
          </div>

          <div className="mt-4">
            <QuietHoursTable data={quietHours ?? []} />
          </div>

          <div className="mt-4">
            <ObservationCard
              observation={
                summary.latestObservation ?? null
              }
            />
          </div>
        </Container>
      </section>
    </div>
  );
}

export default LocationDetailsPage;