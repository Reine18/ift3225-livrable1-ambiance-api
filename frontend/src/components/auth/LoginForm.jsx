import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm({ onSwitchToRegister }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email et mot de passe requis.");
      return;
    }

    try {
      await login({ email, password });
    } catch (err) {
      setError("Email ou mot de passe incorrect. Veuillez réessayer");
    }
  }

  return (
    <div className="form">
      <h1>Connexion</h1>

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

        <button className="btn" type="submit">
          Se connecter
        </button>
      </form>

      <p>
        Pas de compte ?{" "}
        <button type="button" onClick={onSwitchToRegister}>
          S'inscrire
        </button>
      </p>
    </div>
  );
}