import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import LocationDetailsPage from "./pages/LocationDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import PublicMapPage from "./pages/PublicMapPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PublicMapPage />} />

        <Route
          path="/locations/:locationId"
          element={<LocationDetailsPage />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;