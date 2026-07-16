import { useState } from "react";
import { Container, Nav, Navbar as BootstrapNavbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function Navbar() {
  const [activeSection, setActiveSection] = useState("carte");

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
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;