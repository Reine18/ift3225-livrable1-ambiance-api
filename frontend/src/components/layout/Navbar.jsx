import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Container, Nav, Navbar as BootstrapNavbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function Navbar() {
  const [activeSection, setActiveSection] = useState("carte");
  const { isAuthenticated, logout } = useAuth();


  return (
    <BootstrapNavbar
      expand="lg"
      className="ambiance-navbar py-3"
      sticky="top"
    >
      <Container>
        <BootstrapNavbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-4"
          onClick={() => setActiveSection("carte")}
        >
          Ambiance
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle
          aria-controls="ambiance-navigation"
        />

        <BootstrapNavbar.Collapse id="ambiance-navigation">
          <Nav className="ms-auto align-items-lg-center gap-lg-2">
            <Nav.Link
              href="#carte"
              className={activeSection === "carte" ? "active" : ""}
              onClick={() => setActiveSection("carte")}
            >
              Carte
            </Nav.Link>

            <Nav.Link
              href="#about"
              className={activeSection === "about" ? "active" : ""}
              onClick={() => setActiveSection("about")}
            >
              À propos
            </Nav.Link>

            {isAuthenticated ? (
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <Nav.Link as={Link} to="/observation">Observation</Nav.Link>
                <Nav.Link as={Link} to="/favorites">Favoris</Nav.Link>
                <Nav.Link as={Link} to="/mes-lieux">Mes lieux</Nav.Link>
                <Nav.Link as={Link} to="/contributions">Contributions</Nav.Link>
                <Nav.Link onClick={logout}>Se déconnecter</Nav.Link>
              </div>
            ) : (
              <Nav.Link as={Link} to="/auth">
                Se connecter
              </Nav.Link>
            )}
            
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;