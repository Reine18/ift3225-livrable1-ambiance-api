import { describe, it, expect } from "vitest";
import userService from "../services/userService";

const {
  formatUser,
  generateToken,
} = userService;

process.env.JWT_SECRET = "secret-test";

describe("userService", () => {
  describe("formatUser", () => {
    it("retourne les informations publiques du user sans le mot de passe", () => {
      const user = {
        _id: "user123",
        name: "meriem",
        email: "meriem@example.com",
        role: "viewer",
        password: "mot-de-passe-hache",
      };

      const result = formatUser(user);

      // On attend un résultat sans mot de passe
      expect(result).toEqual({
        id: "user123",
        name: "meriem",
        email: "meriem@example.com",
        role: "viewer",
      });

      // Le mot de passe ne doit pas être présent
      expect(result.password).toBeUndefined();
    });

    it("n’expose pas les informations sensibles supplémentaires", () => {
      const user = {
        _id: "user456",
        name: "Meriem",
        email: "meriem@example.com",
        role: "viewer",
        password: "mot-de-passe-hache",
        refreshToken: "token-prive",
        resetPasswordToken: "reset-token-prive",
      };

      const result = formatUser(user);

      expect(result).toEqual({
        id: "user456",
        name: "Meriem",
        email: "meriem@example.com",
        role: "viewer",
      });

      expect(result.password).toBeUndefined();
      expect(result.refreshToken).toBeUndefined();
      expect(result.resetPasswordToken).toBeUndefined();
    });
  });

  describe("generateToken", () => {
    it("génère un token pour un utilisateur valide", () => {
      const user = {
        _id: "user123",
        name: "meriem",
        email: "meriem@example.com",
        role: "viewer",
      };

      const token = generateToken(user);

      // Le token doit être une chaîne de caractères
      expect(token).toEqual(expect.any(String));

      // Le token ne doit pas être vide
      expect(token.length).toBeGreaterThan(0);
    });
  });
});