import { describe, it, expect } from "vitest";
import {
  normalize,
  classifyAmbianceRelative,
  calculateAmbianceSummary,
} from "../services/ambianceService";

describe("ambianceService", () => {
  
    //test sur fonction normalize 
    describe("normalize", () => {
    it("on normalise un nom de location", () => {
      expect(normalize("Bibliothèque Mathématiques Informatique")).toBe(
        "bibliothèque-mathématiques-informatique"
      );
    });
    it("remplace les espaces par -", () => {
      expect(normalize("  Salle___A  ")).toBe("salle-a");
    }); 

    it("on retourne un string vide si le input est null", () => {
      expect(normalize(null)).toBe("");
    });

    
  });

  // test de fontion classifyAmbianceRelative
  describe("classifyAmbianceRelative", () => {
    it("retourne calm pour des valeurs tres basses", () => {
      expect(classifyAmbianceRelative(40, [40, 50, 60, 70])).toBe("calm");
    });

    it("retourne normal opour des valeurs mediane", () => {
      expect(classifyAmbianceRelative(50, [40, 50, 60, 70])).toBe("normal");
    });

    it("retourne unknown lors abscence de donnnees", () => {
      expect(classifyAmbianceRelative(null, [])).toBe("unknown");
    });
  });

  //test sur fonction de calculateAmbianceSummary
  describe("calculateAmbianceSummary", () => {
    it("retourne un resume des locations avec leurs mesures ", () => {
      const measurements = [
        // on simule 2 mesures pour le meme lieu 
        {
          soundLevel: -50,
          timestamp: "2026-08-05T10:00:00.000Z",
          deviceId: { location: "Bibliothèque Mathématiques Informatique" },
        },
        {
          soundLevel: -60,
          timestamp: "2026-08-05T11:00:00.000Z",
          deviceId: { location: "Bibliothèque Mathématiques Informatique" },
        },
      ];
// et on rajoute une observation 
      const observations = [
        {
          location: "Bibliothèque Mathématiques Informatique",
          timestamp: "2026-08-05T11:30:00.000Z",
        },
      ];
// et on calcul le resume 
      const result = calculateAmbianceSummary(
        "Bibliothèque Mathématiques Informatique",
        measurements,
        observations
      );

      expect(result).not.toBeNull();
      expect(result.measurementsCount).toBe(2);  //qui a 2 mesures 
      expect(result.observationsCount).toBe(1);// une seule observation
      expect(result.averageSoundLevel).toBe(55);   // quelle calcule bien la moyenne sonore 
    });

    // deuxieme cas ou il ya aucune donnee et retourne null

    it("retourne null quand la location nexiste pas", () => {
      const result = calculateAmbianceSummary("Lieu inconnu", [], []);
      expect(result).toBeNull();
    });

    // troisieme cas : obervation sans mesures 
    it("handles a location with observations only", () => {
      const observations = [
        {
          location: "Bibliothèque Mathématiques Informatique",
          timestamp: "2026-08-05T11:30:00.000Z",
        },
      ];

      const result = calculateAmbianceSummary(
        "Bibliothèque Mathématiques Informatique",
        [],
        observations
      );

      expect(result).not.toBeNull();
      expect(result.measurementsCount).toBe(0);
      expect(result.observationsCount).toBe(1);
      expect(result.averageSoundLevel).toBeNull();
      expect(result.ambianceLevel).toBe("unknown");
    });
  });
});