import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useLocations from "../hooks/useLocations";
import { getAmbianceSummary } from "../services/ambianceService";
import "./RecommendationPage.css";

function RecommendationPage() {
  const { locations, isLoading, error } = useLocations();

  const [choix, setChoix] = useState("");
  const [donnees, setDonnees] = useState({});
  const [lieuTrouve, setLieuTrouve] = useState(null);
  const [msg, setMsg] = useState("");

  // Les choix proposés à l'utilisateur
  const options = [
    {
      id: "study",
      title: "Étudier ou se concentrer",
      description: "Un lieu calme avec peu de distractions.",
      emoji: "📚",
      ambiance: ["calm"],
    },
    {
      id: "group",
      title: "Travailler ou discuter en groupe",
      description: "Un lieu modéré pour travailler et échanger.",
      emoji: "💬",
      ambiance: ["normal"],
    },
    {
      id: "lively",
      title: "Chercher une ambiance animée",
      description: "Un lieu plus vivant et dynamique.",
      emoji: "🎉",
      ambiance: ["busy", "noisy"],
    },
  ];

  // Charge les informations d'ambiance de chaque lieu
  useEffect(() => {
    async function chargerDonnees() {
      const temp = {};

      for (const loc of locations) {
        try {
          const res = await getAmbianceSummary(loc.idlocation);
          temp[loc.idlocation] = res;
        } catch (err) {
          temp[loc.idlocation] = null;
        }
      }

      setDonnees(temp);
    }

    if (locations.length > 0) {
      chargerDonnees();
    }
  }, [locations]);

  // Cherche le lieu qui correspond le mieux au choix
  function trouverLieu() {
    setLieuTrouve(null);
    setMsg("");

    if (!choix) {
      setMsg("Veuillez choisir une ambiance.");
      return;
    }

    const optionChoisie = options.find(
      (option) => option.id === choix
    );

    // Garde seulement les lieux qui correspondent
    const lieuxOk = locations.filter((loc) => {
      const info = donnees[loc.idlocation];

      if (!info) {
        return false;
      }

      return optionChoisie.ambiance.includes(
        info.ambianceLevel
      );
    });

    if (lieuxOk.length === 0) {
      setMsg("Aucun lieu ne correspond à votre choix.");
      return;
    }

    // Le premier lieu correspondant devient le meilleur au départ
    let meilleur = lieuxOk[0];

    // Compare les dates pour garder les données les plus récentes
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

    setLieuTrouve(meilleur);
  }

  // Informations du lieu recommandé
  const infoLieuTrouve = donnees[lieuTrouve?.idlocation];

  return (
    <main className="recommendation-page">
      <div className="recommendation-container">
        <h1>Trouver le lieu qui vous convient</h1>

        <p className="recommendation-description">
          Choisissez le type d'ambiance que vous recherchez.
        </p>

        {isLoading && <p>Chargement des lieux...</p>}

        {error && (
          <p className="recommendation-error">
            {error}
          </p>
        )}

        <div className="recommendation-grid">
          {options.map((option) => (
            <div
              key={option.id}
              className={
                choix === option.id
                  ? "recommendation-card selected"
                  : "recommendation-card"
              }
              onClick={() => {
                setChoix(option.id);
                setLieuTrouve(null);
                setMsg("");
              }}
            >
              <div className="recommendation-emoji">
                {option.emoji}
              </div>

              <h2>{option.title}</h2>

              <p>{option.description}</p>

              {choix === option.id && (
                <p className="selected-text">
                  ✓ Sélectionné
                </p>
              )}
            </div>
          ))}
        </div>

        <button
          className="recommendation-button"
          onClick={trouverLieu}
          disabled={!choix}
        >
          Trouver un lieu
        </button>

        {msg && (
          <p className="recommendation-message">
            {msg}
          </p>
        )}

        {lieuTrouve && infoLieuTrouve && (
          <div className="recommendation-result">
            <h2>Lieu recommandé</h2>

            <h3>
              {lieuTrouve.name || lieuTrouve.idlocation}
            </h3>

            <p>
              Ambiance actuelle :{" "}
              {infoLieuTrouve.ambianceLevel}
            </p>

            {infoLieuTrouve.averageSoundLevel !== null && (
              <p>
                Niveau sonore moyen :{" "}
                {infoLieuTrouve.averageSoundLevel.toFixed(1)}
              </p>
            )}

            <p>
              Ce lieu a été choisi parce qu'il correspond à
              votre recherche et possède les données les plus
              récentes parmi les lieux correspondants.
            </p>

            <Link
              to={`/locations/${lieuTrouve.idlocation}`}
              className="recommendation-link"
            >
              Voir le portrait
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default RecommendationPage;