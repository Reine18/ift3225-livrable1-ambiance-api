import {
  describe,
  it,
  expect,
  vi,
  afterEach,
} from "vitest";

import * as deviceModule from "../services/deviceService";
import Device from "../models/Device";

const deviceService =
  deviceModule.default || deviceModule;

const {
  createDeviceService,
  getDevicesService,
} = deviceService;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("deviceService", () => {
  describe("createDeviceService", () => {
    it("refuse un device sans name ou location", async () => {
      await expect(
        //refuse si ya pas de location 
        createDeviceService({
          name: "telephone123",
        })
      ).rejects.toMatchObject({
        message: "Les champs name et location sont requis.",
        statusCode: 400,
      });
    });

    it("crée un device avec une clé API", async () => {
      const createdDevice = {
        _id: "device123",
        name: "telephone123",
        location: "Bibliothèque",
        apiKey: "a".repeat(64),
      };

      const createSpy = vi
        .spyOn(Device, "create")
        .mockResolvedValue(createdDevice);

      const result = await createDeviceService({
        name: " telephone123 ",
        location: " Bibliothèque ",
      });

      expect(createSpy).toHaveBeenCalledWith({
        name: "telephone123",
        location: "Bibliothèque",
        locationId: null,
        apiKey: expect.stringMatching(/^[a-f0-9]{64}$/),
      });

      expect(result).toEqual({
        id: "device123",
        name: "telephone123",
        location: "Bibliothèque",
        apiKey: "a".repeat(64),
      });
    });
  });

  describe("getDevicesService", () => {
    it("récupère les devices sans exposer les clés API", async () => {
      const devices = [
        {
          _id: "device123",
          name: "telephone123",
          location: "Bibliothèque",
        },
        {
          _id: "device456",
          name: "Capteur",
          location: "Cafétéria",
        },
      ];

      const selectSpy = vi
        .fn()
        .mockResolvedValue(devices);

      const findSpy = vi
        .spyOn(Device, "find")
        .mockReturnValue({
          select: selectSpy,
        });

      const result = await getDevicesService();

      expect(findSpy).toHaveBeenCalled();

      expect(selectSpy).toHaveBeenCalledWith(
        "-apiKey"
      );

      expect(result).toEqual(devices);
    });
  });
});