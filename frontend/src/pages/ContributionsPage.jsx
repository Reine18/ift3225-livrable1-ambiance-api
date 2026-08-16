import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getObservations } from "../services/observationService";
import { getLocations } from "../services/locationsService";

import Loading from "../components/feedback/Loading";
import Error from "../components/feedback/Error";
import EmptyState from "../components/feedback/EmptyState";

import "./accountList.css";

export default function ContributionsPage() {
  const { user } = useAuth();

  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchObservations() {
      try {
        setLoading(true);
        setError("");

        const allObservations =
          await getObservations();
        const locations = await getLocations();

        const filtered = [];

        for (
          let i = 0;
          i < allObservations.length;
          i++
        ) {
          const obs = allObservations[i];

          const authorId =
            typeof obs.author === "object"
              ? obs.author?._id
              : obs.author;

          if (authorId === user?.id) {
            let locName = obs.location;

            const matchingLocation = locations.find((loc) =>
              loc._id === obs.locationId ||
              loc.idlocation === obs.locationId ||
              loc.name === obs.location ||
              loc.idlocation === obs.location
            );

            const locId =
              matchingLocation?.idlocation ??
              matchingLocation?._id ??
              obs.locationId ??
              obs.location;

            if (matchingLocation?.name) {
              locName = matchingLocation.name;
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
        setError(
          "Impossible de charger vos contributions."
        );
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchObservations();
    } else {
      setObservations([]);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="account-list-page">
        <h1>Mes contributions</h1>

        <Loading message="Chargement de vos contributions..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-list-page">
        <h1>Mes contributions</h1>

        <Error message={error} />
      </div>
    );
  }

  if (observations.length === 0) {
    return (
      <div className="account-list-page">
        <h1>Mes contributions</h1>

        <EmptyState
          title="Aucune contribution"
          message="Vous n'avez pas encore soumis d'observation."
        />
      </div>
    );
  }

  return (
    <div className="account-list-page">
      <h1>Mes contributions</h1>

      <ul>
        {observations.map((obs) => (
          <li key={obs.id}>
            <Link
              to={`/locations/${obs.locationId}`}
            >
              {obs.locationName}
            </Link>

            {" — "}
            {obs.vibe}

            {obs.notes
              ? ` — ${obs.notes}`
              : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}