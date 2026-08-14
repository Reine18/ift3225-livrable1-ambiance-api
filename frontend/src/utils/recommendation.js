// Trouve le meilleur lieu selon l'ambiance choisie
export function trouverMeilleurLieu(locations, donnees, optionChoisie) {
  // Garde seulement les lieux qui correspondent au choix
  const lieuxOk = locations.filter((loc) => {
    const info = donnees[loc.idlocation];

    if (!info) {
      return false;
    }

    return optionChoisie.ambiance.includes(info.ambianceLevel);
  });

  // Aucun lieu trouvé
  if (lieuxOk.length === 0) {
    return null;
  }

  // On prend le premier lieu comme meilleur au départ
  let meilleur = lieuxOk[0];

  // On cherche celui avec les données les plus récentes
  for (const loc of lieuxOk) {
    const infoActuelle = donnees[loc.idlocation];
    const infoMeilleur = donnees[meilleur.idlocation];

    if (
      infoActuelle.latestTimestamp &&
      infoMeilleur.latestTimestamp &&
      new Date(infoActuelle.latestTimestamp) >
        new Date(infoMeilleur.latestTimestamp)
    ) {
      meilleur = loc;
    }
  }

  return meilleur;
}