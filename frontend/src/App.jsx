import { lazy, Suspense } from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./components/layout/Layout";
import Loading from "./components/feedback/Loading";
import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

const AuthPage = lazy(() =>
  import("./components/auth/authPage")
);

const ObservationForm = lazy(() =>
  import("./components/observation/ObservationForm")
);

const FavoritesPage = lazy(() =>
  import("./pages/favoritesPage")
);

const PlacesPage = lazy(() =>
  import("./pages/PlacesPage")
);

const ContributionsPage = lazy(() =>
  import("./pages/ContributionsPage")
);

const RecommendationPage = lazy(() =>
  import("./pages/RecommendationPage")
);

const LocationDetailsPage = lazy(() =>
  import("./pages/LocationDetailsPage")
);

const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage")
);

const PublicMapPage = lazy(() =>
  import("./pages/PublicMapPage")
);

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
      <Suspense
        fallback={
          <Loading message="Chargement de la page..." />
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={<PublicMapPage />}
            />

            <Route
              path="/locations/:locationId"
              element={<LocationDetailsPage />}
            />

            <Route
              path="/auth"
              element={<AuthPage />}
            />

            <Route
              path="/observation"
              element={
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

            <Route
              path="/recommendation"
              element={<RecommendationPage />}
            />

            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;