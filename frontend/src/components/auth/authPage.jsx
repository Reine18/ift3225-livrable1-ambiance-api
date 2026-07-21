import { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./auth.css";
import { useAuth } from "../../context/AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const { isAuthenticated, logout, user } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="auth-page-wrapper">
        <div className="auth-form">
          <h1>Bonjour, {user.name}</h1>
          <p className="auth-form-subtitle">Votre espace compte</p>

          <nav>
            <Link to="/observation">Soumettre une observation</Link>
            <Link to="/favorites">Mes favoris</Link>
            <Link to="/lieux">Mes lieux</Link>
            <Link to="/contributions">Mes contributions</Link>
          </nav>

          <button className="btn" onClick={logout} style={{ marginTop: "1.5rem" }}>
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return mode === "login" ? (
    <LoginForm onSwitchToRegister={() => setMode("register")} />
  ) : (
    <RegisterForm onSwitchToLogin={() => setMode("login")} />
  );
}