import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="ambiance-footer py-4 mt-auto">
      <Container className="d-flex flex-column flex-md-row justify-content-between gap-2">
        <div>
          <p className="fw-semibold mb-1">Ambiance</p>

          <p className="small mb-0">
            Trouver le bon lieu, au bon moment.
          </p>
        </div>

        <div className="text-md-end">
             <p className="small mb-1">
                Projet réalisé dans le cadre du cours IFT3225
             </p>

            <p className="small mb-0">
                © 2026 Projet Ambiance — Université de Montréal. Tous droits réservés.
            </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;