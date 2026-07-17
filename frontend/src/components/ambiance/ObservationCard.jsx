const proximityLabels = {
  near: "Source proche",
  medium: "Source à distance moyenne",
  far: "Source éloignée",
};

const vibeLabels = {
  calm: "Calme",
  normal: "Normal",
  busy: "Animé",
  noisy: "Bruyant",
};

function formatObservationDate(timestamp) {
  return new Intl.DateTimeFormat("fr-CA", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function ObservationCard({ observation }) {
  if (!observation) {
    return (
      <section className="ambiance-card p-4">
        <h2 className="h4 fw-bold mb-2">
          Dernière observation
        </h2>

        <p className="text-secondary mb-0">
          Aucune observation n’est disponible pour ce lieu.
        </p>
      </section>
    );
  }

  return (
    <section className="ambiance-card observation-card p-4">
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 fw-bold mb-2">
            Dernière observation
          </h2>

          <p className="text-secondary mb-0">
            Contexte rapporté sur place par un observateur.
          </p>
        </div>

        <div className="observation-date">
          <i className="bi bi-calendar3 me-2" aria-hidden="true" />
          {formatObservationDate(observation.timestamp)}
        </div>
      </div>

      <blockquote className="observation-quote mb-4">
        “{observation.notes}”
      </blockquote>

      <div className="observation-tags">
        <span className="observation-tag">
          <i className="bi bi-activity me-2" aria-hidden="true" />
          {vibeLabels[observation.vibe] ?? observation.vibe}
        </span>

        <span className="observation-tag">
          <i className="bi bi-broadcast me-2" aria-hidden="true" />
          {proximityLabels[observation.sourceProximity] ??
            observation.sourceProximity}
        </span>
      </div>
    </section>
  );
}

export default ObservationCard;