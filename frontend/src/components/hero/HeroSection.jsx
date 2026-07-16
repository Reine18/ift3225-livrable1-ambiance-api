import { Button, Col, Container, Row } from "react-bootstrap";

function HeroSection() {
  const scrollToMap = () => {
    document.getElementById("carte")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="ambiance-hero">
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={7}>
            <p className="ambiance-hero-eyebrow mb-3">
              Guide d’ambiance des lieux publics
            </p>

            <h1 className="display-4 fw-bold mb-4">
              Trouver le bon lieu, au bon moment.
            </h1>

            <p className="ambiance-hero-description fs-5 mb-4">
              Consultez l’ambiance actuelle des espaces avant de vous déplacer
              et choisissez un environnement adapté à votre activité.
            </p>

            <Button
              type="button"
              className="ambiance-btn-primary ambiance-hero-button"
              onClick={scrollToMap}
            >
              Découvrir les lieux
              <i className="bi bi-arrow-down ms-2" aria-hidden="true" />
            </Button>
          </Col>

          <Col lg={5}>
            <div
              className="ambiance-hero-visual"
              aria-label="Illustration des différents niveaux d’ambiance"
            >
              <div className="ambiance-visual-location location-one">
                <span className="ambiance-visual-icon">🪷</span>
                  <span>
                    <strong>Calme</strong>
                    <small>Étudier</small>
                  </span>
              </div>

              <div className="ambiance-visual-location location-two">
                <span className="ambiance-visual-icon">💬</span>
                  <span>
                    <strong>Modéré</strong>
                    <small>Travailler</small>
                  </span>
              </div>

              <div className="ambiance-visual-location location-three">
                <span className="ambiance-visual-icon">📣</span>
                <span>
                  <strong>Animé</strong>
                  <small>Collaborer</small>
                </span>
              </div>

              <div className="ambiance-visual-center">
                <i className="bi bi-geo-alt-fill" aria-hidden="true" />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default HeroSection;