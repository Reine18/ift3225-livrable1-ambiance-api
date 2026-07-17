function EmptyState({
  title = "Aucune donnée",
  message = "Aucune information n’est disponible pour le moment.",
}) {
  return (
    <div className="ambiance-card text-center p-5">
      <i
        className="bi bi-inbox display-5 text-secondary"
        aria-hidden="true"
      />

      <h1 className="h3 fw-bold mt-3">
        {title}
      </h1>

      <p className="text-secondary mb-0">
        {message}
      </p>
    </div>
  );
}

export default EmptyState;