import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./accountList.css";

export default function PlacesPage() {
  const { user, token } = useAuth();
  const [myPlaces, setMyPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchObservations() {
      try {
        const response = await fetch("http://localhost:3000/observations");
        const result = await response.json();

        if (!result.success) {
          setError("Impossible de charger les lieux.");
          setLoading(false);
          return;
        }

        const seen = {};
        const places = [];

        for (let i = 0; i < result.data.length; i++) {
          const obs = result.data[i];
          if (obs.author && obs.author._id === user?.id) {
            const locId = obs.locationId ? obs.locationId._id : obs.location;
            if (!seen[locId]) {
              seen[locId] = true;
              places.push({
                locationId: locId,
                locationName: obs.locationId
                  ? obs.locationId.name
                  : obs.location,
              });
            }
          }
        }

        setMyPlaces(places);
      } catch (err) {
        setError("Impossible de charger les lieux.");
      } finally {
        setLoading(false);
      }
    }

    fetchObservations();
  }, [user]);

  if (loading) {
    return (
      <div className="account-list-page">
        <h1>Mes lieux</h1>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-list-page">
        <h1>Mes lieux</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (myPlaces.length === 0) {
    return (
      <div className="account-list-page">
        <h1>Mes lieux</h1>
        <p>Vous n'avez pas encore effectué d'écoute dans un lieu.</p>
      </div>
    );
  }

  const items = [];
  for (let i = 0; i < myPlaces.length; i++) {
    const place = myPlaces[i];
    items.push(
      <li key={place.locationId}>
        <Link to={`/locations/${place.locationId}`}>{place.locationName}</Link>
      </li>,
    );
  }

  return (
    <div className="account-list-page">
      <h1>Mes lieux</h1>
      <ul>{items}</ul>
    </div>
  );
}
