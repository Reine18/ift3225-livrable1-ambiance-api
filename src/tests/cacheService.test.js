import {
  describe,
  it,
  expect,
  beforeEach,
} from "vitest";

const {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPrefix,
  clearCache,
} = require("../services/cacheService");

describe("cacheService", () => {
  beforeEach(() => {
    clearCache();
  });

  it("enregistre et récupère une valeur", () => {
    setCache("GET:/test", { message: "ok" }, 1000);

    expect(getCache("GET:/test")).toEqual({
      message: "ok",
    });
  });

  it("supprime une clé précise", () => {
    setCache("GET:/test", { message: "ok" }, 1000);

    deleteCache("GET:/test");

    expect(getCache("GET:/test")).toBeUndefined();
  });

  it("supprime les clés qui commencent par un préfixe", () => {
    setCache("GET:/measurements", { id: 1 }, 1000);
    setCache(
      "GET:/measurements?location=salle-a",
      { id: 2 },
      1000
    );
    setCache("GET:/locations", { id: 3 }, 1000);

    deleteCacheByPrefix("GET:/measurements");

    expect(getCache("GET:/measurements")).toBeUndefined();

    expect(
      getCache("GET:/measurements?location=salle-a")
    ).toBeUndefined();

    expect(getCache("GET:/locations")).toEqual({
      id: 3,
    });
  });

  it("retourne undefined pour une clé inexistante", () => {
    expect(getCache("GET:/inconnue")).toBeUndefined();
  });

  it("retourne undefined après expiration", async () => {
    setCache("GET:/expire", { message: "temporaire" }, 1);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(getCache("GET:/expire")).toBeUndefined();
  });
});