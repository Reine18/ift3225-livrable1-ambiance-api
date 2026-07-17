import { Button } from "react-bootstrap";

function ErrorState({
  title = "Une erreur est survenue",
  message = "Impossible de récupérer les données pour le moment.",
  onRetry,
}) {
  return (
    <div className="ambiance-card text-center p-5" role="alert">
      <i
        className="bi bi-exclamation-triangle display-5 text-warning"
        aria-hidden="true"
      />

      <h2 className="h4 fw-bold mt-3">{title}</h2>

      <p className="text-secondary">{message}</p>

      {onRetry && (
        <Button
          type="button"
          className="ambiance-btn-primary"
          onClick={onRetry}
        >
          Réessayer
        </Button>
      )}
    </div>
  );
}

export default ErrorState;