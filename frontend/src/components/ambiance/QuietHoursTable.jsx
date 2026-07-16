function formatHour(hour) {
  return `${String(hour).padStart(2, "0")} h`;
}

function QuietHoursTable({ data = [] }) {
  if (data.length === 0) {
    return (
      <section className="ambiance-card p-4">
        <h2 className="h4 fw-bold mb-2">
          Créneaux les plus calmes
        </h2>

        <p className="text-secondary mb-0">
          Aucun créneau calme n’est disponible pour ce lieu.
        </p>
      </section>
    );
  }

  const sortedData = [...data].sort(
    (first, second) =>
      first.averageSoundLevel - second.averageSoundLevel
  );

  return (
    <section className="ambiance-card quiet-hours-card p-4">
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-2">
          Créneaux les plus calmes
        </h2>

        <p className="text-secondary mb-0">
          Périodes où les niveaux observés sont les plus faibles.
        </p>
      </div>

      <div className="quiet-hours-list">
        {sortedData.map((item, index) => (
          <article
            key={`${item.hour}-${index}`}
            className="quiet-hour-item"
          >
            <div className="quiet-hour-rank" aria-hidden="true">
              {index + 1}
            </div>

            <div className="flex-grow-1">
              <p className="fw-bold mb-1">
                {formatHour(item.hour)}
              </p>

              <p className="small text-secondary mb-0">
                {item.count} mesure{item.count > 1 ? "s" : ""}
              </p>
            </div>

            <div className="quiet-hour-level text-end">
              <p className="fw-bold mb-1">
                {item.averageSoundLevel.toFixed(2)}
              </p>

              <p className="small text-secondary mb-0">
                Niveau moyen
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default QuietHoursTable;