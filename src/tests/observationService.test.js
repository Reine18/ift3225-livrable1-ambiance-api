import {
  describe,
  it,
  expect,
  vi,
  afterEach,
} from "vitest";


import Observation from "../models/Observation";


import * as observationModule from "../services/observationService";

const observationService =
  observationModule.default || observationModule;

const {
  createObservationService,
  getObservationsService,
} = observationService; 


afterEach(() => {
  vi.restoreAllMocks();
});

describe("observationService", () => {
  describe("createObservationService", () => {
    it("refuse une observation sans location ou vibe", async () => {
      await expect(
        createObservationService({
          location: "bibliotheque",
        })
      ).rejects.toMatchObject({
        message: "location et vibe sont requis.",
        statusCode: 400,
      });
    });
// puisque device alors author est null
    it("crée une observation associée à un device", async () => {
      const createdObservation = {
        _id: "observation123",
        location: "bibliotheque",
        vibe: "calm",
        sourceProximity: "near",
        deviceId: "device123",
        author: null,
      };

      const createSpy = vi
        .spyOn(Observation, "create")
        .mockResolvedValue(createdObservation);

      const result = await createObservationService(
        {
          location: "bibliotheque",
          vibe: "calm",
          sourceProximity: "near",
          notes: "Ambiance calme",
        },
        {
          authType: "device",
          deviceId: "device123",
        }
      );

      expect(createSpy).toHaveBeenCalledWith({
        location: "bibliotheque",
        locationId: null,
        vibe: "calm",
        sourceProximity: "near",
        notes: "Ambiance calme",
        timestamp: expect.any(Number),
        deviceId: "device123",
        author: null,
      });

      expect(result).toEqual(createdObservation);
    });

    it("crée une observation associée à un utilisateur", async () => {
      const createdObservation = {
        _id: "observation456",
        location: "Cafétéria",
        vibe: "busy",
        sourceProximity: "medium",
        deviceId: null,
        author: "user123",
      };

      const createSpy = vi
        .spyOn(Observation, "create")
        .mockResolvedValue(createdObservation);

      const result = await createObservationService(
        {
          location: "Cafétéria",
          vibe: "busy",
          sourceProximity: "medium",
          notes: "Beaucoup de personnes",
        },
        {
          authType: "user",
          authorId: "user123",
        }
      );

      expect(createSpy).toHaveBeenCalledWith({
        location: "Cafétéria",
        locationId: null,
        vibe: "busy",
        sourceProximity: "medium",
        notes: "Beaucoup de personnes",
        timestamp: expect.any(Number),
        deviceId: null,
        author: "user123",
      });

      expect(result).toEqual(createdObservation);
    });
  });

  describe("getObservationsService", () => {
    it("récupère les observations et les trie par date de création", async () => {
      const observations = [
        {
          _id: "observation1",
          location: "Salle 101",
          vibe: "calm",
        },
        {
          _id: "observation2",
          location: "Cafétéria",
          vibe: "busy",
        },
      ];

      const sortSpy = vi
        .fn()
        .mockResolvedValue(observations);

      const populateSpy = vi
        .fn()
        .mockReturnValue({
          sort: sortSpy,
        });

      const findSpy = vi
        .spyOn(Observation, "find")
        .mockReturnValue({
          populate: populateSpy,
        });

      const result = await getObservationsService();

      expect(findSpy).toHaveBeenCalled();

      expect(populateSpy).toHaveBeenCalledWith(
        "deviceId",
        "name location"
      );

      expect(sortSpy).toHaveBeenCalledWith({
        createdAt: -1,
      });

      expect(result).toEqual(observations);
    });
  });
});