// TODO API : supprimer ce fichier lorsqu'il ne sera plus utilisé. 



export const mockLocations = [
  {
    id: "bibliotheque-udem",
    name: "Bibliothèque Mathématiques-Informatique",
    address: "Université de Montréal",
    latitude: 45.5031,
    longitude: -73.6154,
    classification: "calm",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "bibliotheque-parc-extension",
    name: "Bibliothèque de Parc-Extension",
    address: "Montréal",
    latitude: 45.5307,
    longitude: -73.6252,
    classification: "moderate",
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: "cafe-etudiant",
    name: "Café étudiant",
    address: "Campus universitaire",
    latitude: 45.507,
    longitude: -73.611,
    classification: "animated",
    updatedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
];