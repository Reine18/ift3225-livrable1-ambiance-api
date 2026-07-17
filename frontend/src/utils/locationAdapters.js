export function adaptLocation(apiLocation) {
  return {
    id: apiLocation.idlocation ?? apiLocation._id,
    name: apiLocation.name,
    address: apiLocation.address ?? "",
    latitude: apiLocation.latitude,
    longitude: apiLocation.longitude,
    classification:
      apiLocation.classification ??
      apiLocation.ambianceLevel ??
      "stale",
    updatedAt: apiLocation.updatedAt ?? null,
  };
}

export function adaptHistory(apiHistory = []) {
  return apiHistory.map((measurement) => ({
    time: new Intl.DateTimeFormat("fr-CA", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(measurement.timestamp)),
    soundLevel: measurement.soundLevel,
  }));
}