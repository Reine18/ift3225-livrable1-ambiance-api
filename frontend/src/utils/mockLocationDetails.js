// TODO API : supprimer ce fichier lorsqu'il ne sera plus utilisé. 


export const mockLocationDetails = {
  "bibliotheque-udem": {
    id: "bibliotheque-udem",
    name: "Bibliothèque Mathématiques-Informatique",
    address: "Université de Montréal",
    classification: "calm",
    averageSoundLevel: -61.59,
    measurementsCount: 296,
    observationsCount: 6,
    updatedAt: new Date().toISOString(),
    latestObservation: {
      vibe: "calm",
      sourceProximity: "far",
      notes: "Ambiance globale assez calme, propice à la concentration.",
      timestamp: "2026-06-15T23:20:11.008Z",
    },
    history: [
  { time: "18:58", soundLevel: -64.2 },
  { time: "19:02", soundLevel: -62.8 },
  { time: "19:06", soundLevel: -60.7 },
  { time: "19:10", soundLevel: -63.1 },
  { time: "19:14", soundLevel: -59.9 },
  { time: "19:18", soundLevel: -61.4 },
],
quietHours: [
  {
    hour: 9,
    averageSoundLevel: -66,
    count: 12,
  },
  {
    hour: 12,
    averageSoundLevel: -68.02,
    count: 18,
  },
  {
    hour: 18,
    averageSoundLevel: -63.14,
    count: 24,
  },
],
  },

  "bibliotheque-parc-extension": {
    id: "bibliotheque-parc-extension",
    name: "Bibliothèque de Parc-Extension",
    address: "Montréal",
    classification: "moderate",
    averageSoundLevel: -54.8,
    measurementsCount: 184,
    observationsCount: 4,
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    latestObservation: {
      vibe: "normal",
      sourceProximity: "medium",
      notes: "Quelques conversations et déplacements dans la salle.",
      timestamp: "2026-06-15T20:18:51.731Z",
    },
    history: [
  { time: "14:00", soundLevel: -58.1 },
  { time: "14:05", soundLevel: -55.4 },
  { time: "14:10", soundLevel: -53.8 },
  { time: "14:15", soundLevel: -56.2 },
  { time: "14:20", soundLevel: -51.9 },
  { time: "14:25", soundLevel: -54.3 },
],
quietHours: [
  {
    hour: 10,
    averageSoundLevel: -60.4,
    count: 9,
  },
  {
    hour: 14,
    averageSoundLevel: -58.7,
    count: 13,
  },
  {
    hour: 17,
    averageSoundLevel: -57.9,
    count: 8,
  },
],
  },

  "cafe-etudiant": {
    id: "cafe-etudiant",
    name: "Café étudiant",
    address: "Campus universitaire",
    classification: "animated",
    averageSoundLevel: -42.3,
    measurementsCount: 152,
    observationsCount: 5,
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    latestObservation: {
      vibe: "busy",
      sourceProximity: "near",
      notes: "Plusieurs conversations et beaucoup de circulation.",
      timestamp: "2026-06-15T19:10:00.000Z",
    },
    history: [
  { time: "12:00", soundLevel: -46.8 },
  { time: "12:05", soundLevel: -43.1 },
  { time: "12:10", soundLevel: -40.7 },
  { time: "12:15", soundLevel: -44.2 },
  { time: "12:20", soundLevel: -39.8 },
  { time: "12:25", soundLevel: -42.5 },
],
quietHours: [
  {
    hour: 8,
    averageSoundLevel: -50.1,
    count: 7,
  },
  {
    hour: 11,
    averageSoundLevel: -47.6,
    count: 10,
  },
  {
    hour: 16,
    averageSoundLevel: -46.9,
    count: 6,
  },
],
  },
};