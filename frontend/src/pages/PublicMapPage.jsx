import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import CurrentAmbianceBanner from "../components/ambiance/CurrentAmbianceBanner";
import StatsCards from "../components/ambiance/StatsCards";
import HeroSection from "../components/hero/HeroSection";
import LocationCard from "../components/map/LocationCard";
import MapLegend from "../components/map/MapLegend";
import MapView from "../components/map/MapView";
import useLocations from "../hooks/useLocations";
import { getAmbianceSummary } from "../services/ambianceService";

function PublicMapPage() {
  const {
    locations,
    isLoading,
    error,
  } = useLocations();

  const [summaries, setSummaries] = useState({});

  useEffect(() => {
    async function loadSummaries() {
      const results = await Promise.all(
        locations.map(async (location) => {
          try {
            const summary = await getAmbianceSummary(
              location.idlocation
            );

            return [location.idlocation, summary];
          } catch (requestError) {
            return [location.idlocation, null];
          }
        })
      );

      setSummaries(Object.fromEntries(results));
    }

    if (locations.length > 0) {
      loadSummaries();
    }
  }, [locations]);

  const locationsWithSummaries = locations.map((location) => ({
    ...location,
    summary: summaries[location.idlocation] ?? null,
  }));

  return (
    <>
      <HeroSection />

      <section id="carte" className="ambiance-section">
        <Container>
          {isLoading && (
            <p className="text-secondary">
              Chargement des lieux...
            </p>
          )}

          {error && (
            <p className="text-danger">
              {error}
            </p>
          )}

          <div className="mb-4">
            <CurrentAmbianceBanner
              locations={locationsWithSummaries}
            />
          </div>

          <div className="mb-4">
            <StatsCards
              locations={locationsWithSummaries}
            />
          </div>

          <MapView locations={locationsWithSummaries} />

          <MapLegend />

          <div className="mt-5">
            <div className="mb-4">
              <h2 className="ambiance-section-title">
                Comparer les lieux
              </h2>

              <p className="ambiance-section-description">
                Consultez rapidement la classification et la fraîcheur des
                données de chaque lieu.
              </p>
            </div>

            <Row className="g-4">
              {locations.map((location) => (
                <Col
                  key={location.idlocation}
                  xs={12}
                  md={6}
                  lg={4}
                >
                  <LocationCard
                    location={location}
                    summary={
                      summaries[location.idlocation] ?? null
                    }
                  />
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </section>

      <section
        id="about"
        className="ambiance-section ambiance-about-section"
      >
        <Container>
          <h2 className="ambiance-section-title">
            À propos d’Ambiance
          </h2>

          <p className="ambiance-section-description mb-0">
            Ambiance présente les données collectées dans différents lieux afin
            d’aider les usagers à choisir un environnement adapté à leurs
            besoins.
          </p>
        </Container>
      </section>
    </>
  );
}

export default PublicMapPage;