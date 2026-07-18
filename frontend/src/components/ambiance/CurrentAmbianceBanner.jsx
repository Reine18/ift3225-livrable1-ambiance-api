function getCalmLocationsCount(locations) {
  return locations.filter(
    (location) => location.classification === "calm"
  ).length;
}

function getMostRecentUpdate(locations) {
  if (locations.length === 0) {
    return null;
  }

  return locations.reduce((mostRecent, location) => {
    const currentDate = new Date(location.updatedAt);

    if (Number.isNaN(currentDate.getTime())) {
      return mostRecent;
    }

    if (!mostRecent || currentDate > mostRecent) {
      return currentDate;
    }

    return mostRecent;
  }, null);
}

function formatLastUpdate(date) {
  if (!date) {
    return "Aucune mise à jour disponible";
  }

  const differenceMinutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000)
  );

  if (differenceMinutes < 1) {
    return "Mise à jour à l’instant";
  }

  if (differenceMinutes < 60) {
    return `Dernière mise à jour il y a ${differenceMinutes} min`;
  }

  const differenceHours = Math.floor(differenceMinutes / 60);

  return `Dernière mise à jour il y a ${differenceHours} h`;
}

function getCalmAvailabilityPresentation(calmCount) {
  if (calmCount === 0) {
    return {
      icon: "💬",
      title: "Aucun lieu calme disponible",
      description:
        "Consultez les lieux modérés ou revenez un peu plus tard.",
      classification: "moderate",
    };
  }

  if (calmCount === 1) {
    return {
      icon: "🪷",
      title: "1 lieu calme disponible",
      description:
        "Un espace est actuellement propice à l’étude, à la lecture et à la concentration.",
      classification: "calm",
    };
  }

  return {
    icon: "🪷",
    title: `${calmCount} lieux calmes disponibles`,
    description:
      "Des espaces sont actuellement propices à l’étude, à la lecture et à la concentration.",
    classification: "calm",
  };
}

function CurrentAmbianceBanner({ locations = [] }) {
  const calmCount = getCalmLocationsCount(locations);
  const presentation = getCalmAvailabilityPresentation(calmCount);
  const lastUpdate = getMostRecentUpdate(locations);

  return (
    <section
      className={`current-ambiance-banner banner-${presentation.classification}`}
      aria-labelledby="current-ambiance-title"
    >
      <div className="current-ambiance-icon" aria-hidden="true">
        {presentation.icon}
      </div>

      <div className="flex-grow-1">
        <p className="current-ambiance-eyebrow mb-1">
          Ambiance générale actuelle
        </p>

        <h2 id="current-ambiance-title" className="h4 fw-bold mb-2">
          {presentation.title}
        </h2>

        <p className="mb-0 current-ambiance-description">
          {presentation.description}
        </p>
      </div>

      <div className="current-ambiance-meta">
        <p className="small mb-0">
          <i className="bi bi-clock me-1" aria-hidden="true" />
          {formatLastUpdate(lastUpdate)}
        </p>
      </div>
    </section>
  );
}

export default CurrentAmbianceBanner;