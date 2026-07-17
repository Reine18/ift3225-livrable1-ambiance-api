import { getAmbiancePresentation } from "../../utils/ambiancePresentation";

function getDominantClassification(locations) {
  const counts = locations.reduce((result, location) => {
    const classification = location.classification;

    if (classification !== "stale") {
      result[classification] = (result[classification] ?? 0) + 1;
    }

    return result;
  }, {});

  const entries = Object.entries(counts);

  if (entries.length === 0) {
    return "stale";
  }

  entries.sort((first, second) => second[1] - first[1]);

  return entries[0][0];
}

function getMostRecentUpdate(locations) {
  if (locations.length === 0) {
    return null;
  }

  return locations.reduce((mostRecent, location) => {
    const currentDate = new Date(location.updatedAt);

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

function CurrentAmbianceBanner({ locations = [] }) {
  const dominantClassification = getDominantClassification(locations);
  const presentation = getAmbiancePresentation(dominantClassification);
  const lastUpdate = getMostRecentUpdate(locations);

  return (
    <section
      className={`current-ambiance-banner banner-${dominantClassification}`}
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
          {presentation.label}
        </h2>

        <p className="mb-0 current-ambiance-description">
          {presentation.description}
        </p>
      </div>

      <div className="current-ambiance-meta">
        <p className="fw-bold mb-1">
          {locations.length} lieu{locations.length > 1 ? "x" : ""} disponible
          {locations.length > 1 ? "s" : ""}
        </p>

        <p className="small mb-0">
          <i className="bi bi-clock me-1" aria-hidden="true" />
          {formatLastUpdate(lastUpdate)}
        </p>
      </div>
    </section>
  );
}

export default CurrentAmbianceBanner;