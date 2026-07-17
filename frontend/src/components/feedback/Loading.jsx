import { Spinner } from "react-bootstrap";

function Loading({ message = "Chargement des données..." }) {
  return (
    <div
      className="ambiance-card text-center p-5"
      role="status"
      aria-live="polite"
    >
      <Spinner
        animation="border"
        className="mb-3"
        style={{ color: "var(--ambiance-primary)" }}
      />

      <p className="text-secondary mb-0">{message}</p>
    </div>
  );
}

export default Loading;