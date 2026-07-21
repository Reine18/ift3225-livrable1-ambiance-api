import { useState, useEffect } from "react";

export default function FavoriteButton({ locationId }) {
  // état qui indique si CE lieu est déjà dans les favoris
  const [isFavorite, setIsFavorite] = useState(false);

  // au chargement du bouton, on vérifie si ce lieu est déjà dans les favoris stockés
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(stored.includes(locationId));
  }, [locationId]);

  // ajoute ou retire ce lieu de la liste des favoris dans le localStorage
  function toggleFavorite() {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorite) {
      // le lieu est déjà favori, on le retire de la liste
      const updated = stored.filter((id) => id !== locationId);
      localStorage.setItem("favorites", JSON.stringify(updated));
    } else {
      // le lieu n'est pas favori, on l'ajoute à la liste
      stored.push(locationId);
      localStorage.setItem("favorites", JSON.stringify(stored));
    }

    setIsFavorite(!isFavorite);
  }

  // choisit l'icône et le texte à afficher selon l'état actuel
  let iconClass = "bi bi-star";
  let label = " Ajouter aux favoris";

  if (isFavorite) {
    iconClass = "bi bi-star-fill";
    label = " Favori";
  }

  return (
    <button onClick={toggleFavorite}>
      <i
        className={iconClass}
        style={isFavorite ? { color: "#f4c542" } : {}}
      />
      {label}
    </button>
  );
}