import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <Container className="py-5 text-center">
      <h1 className="display-4 fw-bold">404</h1>

      <p className="fs-5 text-secondary">
        La page demandée n’existe pas.
      </p>

      <Button
        as={Link}
        to="/"
        className="ambiance-btn-primary"
      >
        Retour à la carte
      </Button>
    </Container>
  );
}

export default NotFoundPage;