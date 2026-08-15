export const FRESHNESS_THRESHOLD_MINUTES = 30;

export function getFreshness(updatedAt) {
  if (!updatedAt) {
    return {
      isFresh: false,
      minutes: null,
      label: "Date de mise à jour inconnue",
    };
  }

  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return {
      isFresh: false,
      minutes: null,
      label: "Date de mise à jour invalide",
    };
  }

  const minutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000)
  );

  if (minutes < 1) {
    return {
      isFresh: true,
      minutes,
      label: "Mise à jour à l’instant",
    };
  }

  if (minutes < 60) {
    return {
      isFresh: minutes <= FRESHNESS_THRESHOLD_MINUTES,
      minutes,
      label: `Mise à jour il y a ${minutes} min`,
    };
  }

  const hours = Math.floor(minutes / 60);

  return {
    isFresh: false,
    minutes,
    label: `Mise à jour il y a ${hours} h`,
  };
}

export function formatUpdatedAt(updatedAt) {
  if (!updatedAt) {
    return "Aucune mise à jour disponible";
  }

  const updatedDate = new Date(updatedAt);

  if (Number.isNaN(updatedDate.getTime())) {
    return "Date de mise à jour indisponible";
  }

  const differenceMinutes = Math.max(
    0,
    Math.floor((Date.now() - updatedDate.getTime()) / 60000)
  );

  if (differenceMinutes < 1) {
    return "Mise à jour à l’instant";
  }

  if (differenceMinutes < 60) {
    return `Mise à jour il y a ${differenceMinutes} min`;
  }

  const differenceHours = Math.floor(differenceMinutes / 60);

  if (differenceHours < 24) {
    return `Mise à jour il y a ${differenceHours} h`;
  }

  const differenceDays = Math.floor(differenceHours / 24);

  return `Mise à jour il y a ${differenceDays} j`;
}