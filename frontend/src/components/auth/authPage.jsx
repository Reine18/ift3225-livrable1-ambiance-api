import { useState } from "react";
import { Link } from "react-router-dom";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

import "./auth.css";

import { useAuth } from "../../context/AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return (
      <main className="account-page">
        <div className="account-container">
          <section className="account-header">
            <p className="account-eyebrow">
              Espace personnel
            </p>

            <h1>
              Bonjour, {user?.name} 👋
            </h1>

            <p className="account-description">
              Gérez vos observations, vos favoris et vos lieux
              depuis un seul endroit.
            </p>
          </section>

          <section className="account-grid">
            <Link
              to="/observation"
              className="account-card"
            >
              <div className="account-card-icon">
                <i className="bi bi-plus-circle"></i>
              </div>

              <h2>Soumettre une observation</h2>

              <p>
                Partagez l'ambiance actuelle d'un lieu.
              </p>

              <span className="account-card-link">
                Ajouter une observation →
              </span>
            </Link>

            <Link
              to="/favorites"
              className="account-card"
            >
              <div className="account-card-icon">
                <i className="bi bi-heart"></i>
              </div>

              <h2>Mes favoris</h2>

              <p>
                Retrouvez rapidement les lieux que vous préférez.
              </p>

              <span className="account-card-link">
                Voir mes favoris →
              </span>
            </Link>

            <Link
              to="/lieux"
              className="account-card"
            >
              <div className="account-card-icon">
                <i className="bi bi-geo-alt"></i>
              </div>

              <h2>Mes lieux</h2>

              <p>
                Consultez les lieux liés à votre espace.
              </p>

              <span className="account-card-link">
                Voir mes lieux →
              </span>
            </Link>

            <Link
              to="/contributions"
              className="account-card"
            >
              <div className="account-card-icon">
                <i className="bi bi-chat-left-text"></i>
              </div>

              <h2>Mes contributions</h2>

              <p>
                Consultez les observations que vous avez soumises.
              </p>

              <span className="account-card-link">
                Voir mes contributions →
              </span>
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return mode === "login" ? (
    <LoginForm
      onSwitchToRegister={() => setMode("register")}
    />
  ) : (
    <RegisterForm
      onSwitchToLogin={() => setMode("login")}
    />
  );
}