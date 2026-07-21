import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./accountList.css";

export default function ContributionsPage() {
  const { user } = useAuth();
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchObservations() {
      try {
        const response = await fetch("http://localhost:3000/observations");
        const result = await response.json();

        if (!result.success) {
          setError("Impossible de charger vos contributions.");
          setLoading(false);
          return;
        }

        const filtered = [];
        for (let i = 0; i < result.data.length; i++) {
          const obs = result.data[i];

          if (obs.author && obs.author._id === user?.id) {
            let locId = obs.location;
            let locName = obs.location;

            if (obs.locationId) {
              locId = obs.locationId._id;
              locName = obs.locationId.name;
            }

            filtered.push({
              id: obs._id,
              locationId: locId,
              locationName: locName,
              vibe: obs.vibe,
              notes: obs.notes,
            });
          }
        }

        setObservations(filtered);
      } catch (err) {
        setError("Impossible de charger vos contributions.");
      } finally {
        setLoading(false);
      }
    }

    fetchObservations();
  }, [user]);

  if (loading) {
    return (
      <div className="account-list-page">
        <h1>Mes contributions</h1>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-list-page">
        <h1>Mes contributions</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (observations.length === 0) {
    return (
      <div className="account-list-page">
        <h1>Mes contributions</h1>
        <p>Vous n'avez pas encore soumis d'observation.</p>
      </div>
    );
  }

  const items = [];
  for (let i = 0; i < observations.length; i++) {
    const obs = observations[i];
    items.push(
      <li key={obs.id}>
        <Link to={`/locations/${obs.locationId}`}>{obs.locationName}</Link>
        {" — "}
        {obs.vibe} — {obs.notes}
      </li>
    );
  }

  return (
    <div className="account-list-page">
      <h1>Mes contributions</h1>
      <ul>{items}</ul>
    </div>
  );
}