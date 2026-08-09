import {
  describe,
  it,
  expect,
  vi,
  afterEach,
} from "vitest";

import userMeasurementService from "../services/measurementService";
import Measurement from "../models/Measurement";

const {
  createMeasurementService,
  getMeasurementsService,
} = userMeasurementService;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("measurementService", () => {
  describe("createMeasurementService", () => {
    it("refuse une mesure si soundLevel ou amplitude est absent", async () => {
      await expect(
        //il manque lamplitude : doit refuser la requete , renvoie le bon message et renvoie le code 
        createMeasurementService({
          deviceId: "device123",
          soundLevel: 50,
        })
        //le service est une fonction asychrone qui rejette une erreur
      ).rejects.toMatchObject({
        message: "Les champs soundLevel et amplitude sont requis.",
        statusCode: 400,
      });
    });

    it("crée une mesure avec des données valides", async () => {
      const createdMeasurement = {
        _id: "measurement123",
        deviceId: "device123",
        soundLevel: 66,
        amplitude: 25,
        timestamp: new Date(),
      };
// creation reussie 
      const createSpy = vi
        .spyOn(Measurement, "create") // on simule measurement.create 
        .mockResolvedValue(createdMeasurement);

      const result = await createMeasurementService({
        deviceId: "device123",
        soundLevel: 66,
        amplitude: 25,
      });

      expect(createSpy).toHaveBeenCalledWith({
        deviceId: "device123",
        soundLevel: 66,
        amplitude: 25,
        //si aucun timestamp est fourni use date.now
        timestamp: expect.any(Number),
      });

      expect(result).toEqual(createdMeasurement);
    });
  });
// test 3 recuperation des mesures 
  describe("getMeasurementsService", () => {
    it("récupère les mesures et les trie par date de création", async () => {
      const measurements = [
        {
          _id: "measurement1",
          soundLevel: 70,
          amplitude: 30,
        },
        {
          _id: "measurement2",
          soundLevel: 60,
          amplitude: 15,
        },
      ];
      // on recupere toutes les mesures et ajoute les info du device et trie les resultats par date de creation
async function getMeasurementsService() {
  return Measurement.find()
    .populate("deviceId", "name location")
    .sort({ createdAt: -1 });
}


      const sortSpy = vi
        .fn()
        .mockResolvedValue(measurements);

      const populateSpy = vi
        .fn()
        .mockReturnValue({
          sort: sortSpy,
        });

      const findSpy = vi
        .spyOn(Measurement, "find")
        .mockReturnValue({
          populate: populateSpy,
        });

      const result = await getMeasurementsService();

      expect(findSpy).toHaveBeenCalled();

      expect(populateSpy).toHaveBeenCalledWith(
        "deviceId",
        "name location"
      );

      expect(sortSpy).toHaveBeenCalledWith({
        createdAt: -1,
      });

      expect(result).toEqual(measurements);
    });
  });
});