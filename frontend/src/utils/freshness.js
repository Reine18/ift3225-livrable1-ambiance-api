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