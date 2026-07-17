import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./components/auth/authPage";
import LocationDetailsPage from "./pages/LocationDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import PublicMapPage from "./pages/PublicMapPage";

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

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
      
  );
}

export default App;