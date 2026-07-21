import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./observationForm.css";

export default function ObservationForm() {
  const { token } = useAuth();

  const [location, setLocation] = useState("");
  const [vibe, setVibe] = useState("calm");
  const [sourceProximity, setSourceProximity] = useState("near");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
  e.preventDefault();
  setError("");
  setSuccess(false);

  if (!location || !vibe) {
    setError("Le lieu et l'ambiance sont requis.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/observations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ location, vibe, sourceProximity, notes }),
    });

    const result = await response.json();

    if (!result.success) {
      setError(result.message || "Impossible de soumettre l'observation.");
      return;
    }

    setSuccess(true);
    setLocation("");
    setNotes("");
  } catch (err) {
    setError("Impossible de soumettre l'observation.");
  }
}

  const handleReset = () => {
    setLocation("");
    setVibe("calm");
    setSourceProximity("near");
    setNotes("");
    setError("");
    setSuccess(false);
  };

  return (
    <div className="observation-page-wrapper">
      <div className="observation-form">
        <h1>Soumettre une observation</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="location">Lieu*</label>
          <input
            type="text"
            name="location"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Nom du lieu"
            required
          />

          <label htmlFor="vibe">Ambiance*</label>
          <select
            name="vibe"
            id="vibe"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
          >
            <option value="calm">Calme</option>
            <option value="normal">Normal</option>
            <option value="busy">Animé</option>
            <option value="noisy">Bruyant</option>
          </select>

          <label htmlFor="sourceProximity">Proximité</label>
          <select
            name="sourceProximity"
            id="sourceProximity"
            value={sourceProximity}
            onChange={(e) => setSourceProximity(e.target.value)}
          >
            <option value="near">Proche</option>
            <option value="medium">Moyenne</option>
            <option value="far">Loin</option>
          </select>

          <label htmlFor="notes">Notes</label>
          <textarea
            name="notes"
            id="notes"
            cols="30"
            rows="5"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes additionnelles"
          ></textarea>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">Observation enregistrée !</p>}

          <button type="reset" onClick={handleReset}>
            Réinitialiser
          </button>
          <button type="submit" onClick={handleSubmit}>
            Soumettre
          </button>
        </form>
      </div>
    </div>
  );
}
 