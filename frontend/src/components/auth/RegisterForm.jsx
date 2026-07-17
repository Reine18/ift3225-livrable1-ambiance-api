import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function RegisterForm({ onSwitchToLogin }) {
  const { register } = useAuth();

  // états pour l'inscription
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // états pour la vérification d'erreurs
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Tous les champs sont requis.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await register({ name, email, password });
    } catch (err) {
      setError("Inscription impossible. Réessaie plus tard.");
    }
  }

  return (
    <div className="form">
      <h1>Inscription</h1>

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="label">Nom</label>
        <input
          className="input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="label">Mot de passe</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="label">Confirmer le mot de passe</label>
        <input
          className="input"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="btn" type="submit">
          S'inscrire
        </button>
      </form>
      <p>
        Déjà un compte ?{" "}
        <button type="button" onClick={onSwitchToLogin}>
          Se connecter
        </button>
      </p>

    </div>
  );

}
