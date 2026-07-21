import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./favoritesPage.css";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFavorites() {
      const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");

      if (favoriteIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/locations");
        const result = await response.json();

        if (!result.success) {
          setError("Impossible de charger vos favoris.");
          setLoading(false);
          return;
        }

        const matched = [];
        for (let i = 0; i < result.data.length; i++) {
          const loc = result.data[i];
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
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-page">
        <h1>Mes favoris</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <h1>Mes favoris</h1>
        <p>Vous n'avez pas encore de lieux favoris.</p>
      </div>
    );
  }

  const items = [];
  for (let i = 0; i < favorites.length; i++) {
    const loc = favorites[i];
    items.push(
      <li key={loc._id || loc.idlocation}>
        <Link to={`/locations/${loc._id || loc.idlocation}`}>{loc.name}</Link>
      </li>,
    );
  }

  return (
    <div className="favorites-page">
      <h1>Mes favoris</h1>
      <ul>{items}</ul>
    </div>
  );
}
