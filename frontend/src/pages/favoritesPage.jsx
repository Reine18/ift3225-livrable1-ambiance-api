import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getLocations } from "../services/locationsService";
import Loading from "../components/feedback/Loading";
import Error from "../components/feedback/Error";
import EmptyState from "../components/feedback/EmptyState";
import "./favoritesPage.css";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFavorites() {
      const favoriteIds = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );

      if (favoriteIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const locations = await getLocations();

        const matched = [];

        for (let i = 0; i < locations.length; i++) {
          const loc = locations[i];

          if (
            favoriteIds.includes(loc._id) ||
            favoriteIds.includes(loc.idlocation)
          ) {
            matched.push(loc);
          }
        }

        setFavorites(matched);
      } catch (err) {
        setError("Impossible de charger vos favoris.");
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  if (loading) {
  return (
    <div className="favorites-page">
      <h1>Mes favoris</h1>
      <Loading message="Chargement de vos favoris..." />
    </div>
  );
}

  if (error) {
  return (
    <div className="favorites-page">
      <h1>Mes favoris</h1>
      <Error message={error} />
    </div>
  );
}

  if (favorites.length === 0) {
  return (
    <div className="favorites-page">
      <h1>Mes favoris</h1>
      <EmptyState
        title="Aucun favori"
        message="Vous n'avez pas encore de lieux favoris."
      />
    </div>
  );
}

  return (
    <div className="favorites-page">
      <h1>Mes favoris</h1>

      <ul>
        {favorites.map((loc) => (
          <li key={loc._id || loc.idlocation}>
            <Link to={`/locations/${loc.idlocation || loc._id}`}>
              {loc.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}