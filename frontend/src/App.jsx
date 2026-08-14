import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./components/auth/authPage";
import ObservationForm from "./components/observation/ObservationForm";
import FavoritesPage from "./pages/FavoritesPage";
import PlacesPage from "./pages/PlacesPage";
import ContributionsPage from "./pages/ContributionsPage";
import RecommendationPage from "./pages/RecommendationPage";
import LocationDetailsPage from "./pages/LocationDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import PublicMapPage from "./pages/PublicMapPage";


function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PublicMapPage />} />

          <Route
            path="/locations/:locationId"
            element={<LocationDetailsPage />}
          />

          <Route path="/auth" element={<AuthPage />} />
          <Route path="/observation" element={
            <PrivateRoute>
              <ObservationForm />
            </PrivateRoute>
          }
          />

          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/lieux"
            element={
              <PrivateRoute>
                <PlacesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/contributions"
            element={
              <PrivateRoute>
                <ContributionsPage />
              </PrivateRoute>
            }
          />


          <Route path="/recommendation" element={<RecommendationPage />}/>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
