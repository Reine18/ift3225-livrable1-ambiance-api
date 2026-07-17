import { Col, Container, Row } from "react-bootstrap";

import HeroSection from "../components/hero/HeroSection";
import LocationCard from "../components/map/LocationCard";
import MapLegend from "../components/map/MapLegend";
import MapView from "../components/map/MapView";
import { mockLocations } from "../utils/mockLocations";
import StatsCards from "../components/ambiance/StatsCards";
import CurrentAmbianceBanner from "../components/ambiance/CurrentAmbianceBanner";


function PublicMapPage() {
  return (
    <>
      <HeroSection />

       <section id="carte" className="ambiance-section">
  <Container>
    <div className="mb-4">
      <CurrentAmbianceBanner locations={mockLocations} />
    </div>

<div className="mb-4">
  <StatsCards locations={mockLocations} />
</div>

<MapView locations={mockLocations} />

    <MapLegend />

    <div className="mt-5">
      <div className="mb-4">
        <h2 className="ambiance-section-title">
          Comparer les lieux
        </h2>

        <p className="ambiance-section-description">
          Consultez rapidement la classification et la fraîcheur des données
          de chaque lieu.
        </p>
      </div>

      <Row className="g-4">
        {mockLocations.map((location) => (
          <Col key={location.id} xs={12} md={6} lg={4}>
            <LocationCard location={location} />
          </Col>
        ))}
      </Row>
    </div>
  </Container>
</section>

      <section id="about" className="ambiance-section ambiance-about-section">
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