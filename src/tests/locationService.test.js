import {
  describe,
  it,
  expect,
  vi,
  afterEach,
} from "vitest";

import * as locationModule from "../services/locationService";
import Location from "../models/Location";
const locationService =
  locationModule.default || locationModule;

const {
  getLocationsService,
  createLocationService,
} = locationService;

afterEach(() => {
  vi.restoreAllMocks();
});
//refuse lieu sans long test1
describe("locationService", () => {
  describe("createLocationService", () => {
    it("refuse un lieu si un champ obligatoire est absent", async () => {
      await expect(
        createLocationService({
          idlocation: "loc123",
          name: "Bibliothèque",
          latitude: 45.5,
        })
      ).rejects.toMatchObject({
        message:
          "idlocation, name, latitude et longitude sont requis",
        statusCode: 400,
      });
    });
//test2 refuse lieu qui existe deja
    it("refuse un lieu qui existe déjà", async () => {
      const existingLocation = {
        _id: "location123",
        idlocation: "biblio",
        name: "Bibliothèque",
      };

      const findOneSpy = vi
        .spyOn(Location, "findOne")
        .mockResolvedValue(existingLocation);

      await expect(
        createLocationService({
          idlocation: "BIBLIO",
          name: "Bibliothèque",
          latitude: 45.5,
          longitude: -73.6,
        })
      ).rejects.toMatchObject({
        message: "Ce lieu existe déjà",
        statusCode: 409,
      });

      expect(findOneSpy).toHaveBeenCalledWith({
        idlocation: "biblio",
      });
    });

    it("crée un lieu avec des données valides", async () => {
      const createdLocation = {
        _id: "location456",
        idlocation: "biblio",
        name: "Bibliothèque",
        latitude: 45.5,
        longitude: -73.6,
      };

      const findOneSpy = vi
        .spyOn(Location, "findOne")
        .mockResolvedValue(null);

      const createSpy = vi
        .spyOn(Location, "create")
        .mockResolvedValue(createdLocation);

      const result = await createLocationService({
        idlocation: " BIBLIO ",
        name: " Bibliothèque ",
        latitude: 45.5,
        longitude: -73.6,
      });

      expect(findOneSpy).toHaveBeenCalledWith({
        idlocation: "biblio",
      });

      expect(createSpy).toHaveBeenCalledWith({
        idlocation: "biblio",
        name: "Bibliothèque",
        latitude: 45.5,
        longitude: -73.6,
      });

      expect(result).toEqual(createdLocation);
    });
  });

  describe("getLocationsService", () => {
    it("récupère les lieux et les trie par nom", async () => {
      const locations = [
        {
          idlocation: "cafeteria",
          name: "Cafétéria",
          latitude: 45.5,
          longitude: -73.6,
        },
        {
          idlocation: "biblio",
          name: "Bibliothèque",
          latitude: 45.5,
          longitude: -73.6,
        },
      ];

      const sortSpy = vi
        .fn()
        .mockResolvedValue(locations);

      const selectSpy = vi
        .fn()
        .mockReturnValue({
          sort: sortSpy,
        });

      const findSpy = vi
        .spyOn(Location, "find")
        .mockReturnValue({
          select: selectSpy,
        });

      const result = await getLocationsService();

      expect(findSpy).toHaveBeenCalled();

      expect(selectSpy).toHaveBeenCalledWith(
        "idlocation name latitude longitude"
      );

      expect(sortSpy).toHaveBeenCalledWith({
        name: 1,
      });

      expect(result).toEqual(locations);
    });
  });
});