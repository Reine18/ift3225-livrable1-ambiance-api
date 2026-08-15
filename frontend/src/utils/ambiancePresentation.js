export const ambiancePresentation = {
  calm: {
    icon: "🪷",
    label: "Calme",
    description: "Moment idéal pour étudier, lire ou se concentrer.",
    statusClass: "location-status-calm",
    legendClass: "legend-calm",
    markerClass: "marker-calm",
  },

  moderate: {
    icon: "💬",
    label: "Modéré",
    description: "Quelques conversations et déplacements autour de vous.",
    statusClass: "location-status-moderate",
    legendClass: "legend-moderate",
    markerClass: "marker-moderate",
  },

  animated: {
    icon: "📣",
    label: "Animé",
    description: "Lieu dynamique, adapté aux échanges et au travail collaboratif.",
    statusClass: "location-status-animated",
    legendClass: "legend-animated",
    markerClass: "marker-animated",
  },

  stale: {
    icon: "🕰️",
    label: "Données anciennes",
    description: "Les informations disponibles ne sont plus suffisamment récentes.",
    statusClass: "location-status-stale",
    legendClass: "legend-stale",
    markerClass: "marker-stale",
  },
};

export function getAmbiancePresentation(classification) {
  return ambiancePresentation[classification] ?? ambiancePresentation.stale;
}

export function normalizeClassification(ambianceLevel) {
  switch (ambianceLevel) {
    case "calm":
      return "calm";

    case "normal":
      return "moderate";

    case "busy":
    case "noisy":
      return "animated";

    default:
      return "stale";
  }
}