import { Link } from "react-router-dom";
import { mockLocationDetails } from "../utils/mockLocationDetails";

export default function FavoritesPage() {
  const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");

  const favoriteLocations = [];
  for (let i = 0; i < favoriteIds.length; i++) {
    const loc = mockLocationDetails[favoriteIds[i]];
    if (loc) {
      favoriteLocations.push(loc);
    }
  }

  if (favoriteLocations.length === 0) {
    return (
      <div>
        <h1>Mes favoris</h1>
        <p>Vous n'avez pas encore de lieux favoris.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Mes favoris</h1>
      <ul>
        {favoriteLocations.map((location) => (
          <li key={location.id}>
            <Link to={`/locations/${location.id}`}>{location.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}