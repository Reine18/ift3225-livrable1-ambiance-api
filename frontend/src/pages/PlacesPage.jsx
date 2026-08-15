import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import useMyPlaces from "../hooks/useMyPlaces";

import Loading from "../components/feedback/Loading";
import Error from "../components/feedback/Error";
import EmptyState from "../components/feedback/EmptyState";

import "./accountList.css";

export default function PlacesPage() {
  const { user } = useAuth();

  const {
    myPlaces,
    isLoading,
    error,
  } = useMyPlaces(user);

  if (isLoading) {
    return (
      <div className="account-list-page">
        <h1>Mes lieux</h1>
        <Loading message="Chargement de vos lieux..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-list-page">
        <h1>Mes lieux</h1>
        <Error message={error} />
      </div>
    );
  }

  if (myPlaces.length === 0) {
    return (
      <div className="account-list-page">
        <h1>Mes lieux</h1>
        <EmptyState
          title="Aucun lieu"
          message="Vous n'avez pas encore effectué d'écoute dans un lieu."
        />
      </div>
    );
  }

  return (
    <div className="account-list-page">
      <h1>Mes lieux</h1>

      <ul>
        {myPlaces.map((place) => (
          <li key={place.locationId}>
            <Link to={`/locations/${place.locationId}`}>
              {place.locationName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}