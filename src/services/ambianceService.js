

function classifyAmbianceRelative(value, values) {
  if (value === null || values.length === 0) {
    return "unknown";
  }

  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor((sorted.length - 1) * 0.25)];
  const q2 = sorted[Math.floor((sorted.length - 1) * 0.50)];
  const q3 = sorted[Math.floor((sorted.length - 1) * 0.75)];

  if (value <= q1) return "calm";
  if (value <= q2) return "normal";
  if (value <= q3) return "busy";
  return "noisy";
}
// nom de lieu rend en minuscule, supp des espaces inutiles et les espace en -
function normalize(str) {
  if (!str) return "";
  return str.toLowerCase().trim().replace(/[\s_]+/g, "-");
}
//Elle transforme une moyenne sonore en catégorie
function classifyProjectedLevel(averageSoundLevel) {
  if (averageSoundLevel === null) {
    return "unknown";
  }

  if (averageSoundLevel < 55) return "calm";
  if (averageSoundLevel < 65) return "normal";
  return "busy";
}
//dépend du nombre de mesures disponibles
function getConfidence(count) {
  if (count >= 20) return "high";
  if (count >= 8) return "medium";
  if (count >= 3) return "low";
  return "insufficient";
}
// filtre toutes les mesures pour garder seulement celles du lieu demandé
//compare : measurement.deviceId.location avec le nom normalisé du lieu.
function buildLocationMeasurements(measurements, normalizedLocation) {
  return measurements.filter(
    (measurement) =>
      measurement.deviceId &&
      normalize(measurement.deviceId.location) === normalizedLocation
  );
}

function buildObservations(observations, normalizedLocation) {
  return observations.filter(
    (obs) => normalize(obs.location) === normalizedLocation
  );
}
//extrait les niveaux sonores ,calcule la moyenne , renvoie à la fois la liste des niveaux et la moyenne.
function calculateAverageSoundLevel(locationMeasurements) {
  const soundLevels = locationMeasurements.map((measurement) =>
    Math.abs(measurement.soundLevel)
  );

  const averageSoundLevel =
    soundLevels.length > 0
      ? soundLevels.reduce((sum, value) => sum + value, 0) / soundLevels.length
      : null;

  return { soundLevels, averageSoundLevel };
}
//compare : la dernière mesure et la dernière observation. Puis elle retourne la date la plus récente
function calculateLatestTimestamp(latestMeasurement, latestObservation) {
  return (
    [
      latestMeasurement?.timestamp,
      latestObservation?.timestamp,
    ]
      .filter(Boolean)
      .map((timestamp) => new Date(timestamp))
      .sort((a, b) => b - a)[0] || null
  );
}
// normalise le lieu ;
// filtre les mesures ;
// filtre les observations ;
// calcule la moyenne ;
// détermine l’ambiance ;
// récupère les derniers éléments ;
// retourne l’objet final
function calculateAmbianceSummary(location, measurements, observations) {
  const normalizedLocation = normalize(location);
  const locationMeasurements = buildLocationMeasurements(
    measurements,
    normalizedLocation
  );
  const locationObservations = buildObservations(observations, normalizedLocation);

  if (locationMeasurements.length === 0 && locationObservations.length === 0) {
    return null;
  }

  const { soundLevels, averageSoundLevel } =
    calculateAverageSoundLevel(locationMeasurements);

  const ambianceLevel =
    averageSoundLevel !== null
      ? classifyAmbianceRelative(averageSoundLevel, soundLevels)
      : "unknown";

  const latestMeasurement = locationMeasurements[0] || null;
  const latestObservation = locationObservations[0] || null;
  const latestTimestamp = calculateLatestTimestamp(
    latestMeasurement,
    latestObservation
  );

  return {
    location, measurementsCount: locationMeasurements.length, observationsCount: locationObservations.length,
    averageSoundLevel,ambianceLevel,
    latestMeasurement,latestObservation,latestTimestamp,
  };
}

// limite le nombre d’heures demandées ;
// filtre les mesures ;
// regroupe l’historique par heure ;
// calcule la projection pour les prochaines heures ;
// attribue une classification ;
// attribue un niveau de confiance.
function calculateQuietHours(location, measurements) {
  const normalizedLocation = normalize(location);
  const locationMeasurements = buildLocationMeasurements(
    measurements,
    normalizedLocation
  );

  if (locationMeasurements.length === 0) {
    return null;
  }

  const hourlyData = {};

  locationMeasurements.forEach((measurement) => {
    const hour = new Date(measurement.timestamp).getHours();

    if (!hourlyData[hour]) {
      hourlyData[hour] = {
        hour,
        count: 0,
        totalSoundLevel: 0,
      };
    }

    hourlyData[hour].count += 1;
    hourlyData[hour].totalSoundLevel += Math.abs(measurement.soundLevel);
  });

  return Object.values(hourlyData)
    .map((item) => ({
      hour: item.hour,
      averageSoundLevel: item.totalSoundLevel / item.count,
      count: item.count,
    }))
    .sort((a, b) => a.averageSoundLevel - b.averageSoundLevel);
}


// normalize
// classifyAmbianceRelative
// classifyProjectedLevel
// getConfidence
// buildLocationMeasurements
// buildObservations
// calculateAverageSoundLevel
// calculateLatestTimestamp
// calculateAmbianceSummary
// calculateQuietHours
// calculateAmbianceForecast
function calculateAmbianceForecast(location, measurements, requestedHours = 6) {
  const normalizedLocation = normalize(location);
  const forecastHours = Math.min(Math.max(Number(requestedHours) || 6, 1), 12);

  const locationMeasurements = buildLocationMeasurements(
    measurements,
    normalizedLocation
  );

  if (locationMeasurements.length === 0) {
    return null;
  }

  const historicalByHour = {};

  locationMeasurements.forEach((measurement) => {
    const date = new Date(measurement.timestamp);

    if (Number.isNaN(date.getTime())) return;

    const hour = date.getHours();
    const soundLevel = Math.abs(Number(measurement.soundLevel));

    if (!Number.isFinite(soundLevel)) return;

    if (!historicalByHour[hour]) {
      historicalByHour[hour] = {
        totalSoundLevel: 0,
        count: 0,
      };
    }

    historicalByHour[hour].totalSoundLevel += soundLevel;
    historicalByHour[hour].count += 1;
  });

  const now = new Date();

  return Array.from({ length: forecastHours }, (_, index) => {
    const projectedDate = new Date(now);
    projectedDate.setHours(now.getHours() + index + 1, 0, 0, 0);

    const hour = projectedDate.getHours();
    const historicalData = historicalByHour[hour];

    if (!historicalData) {
      return {
        hour,
        projectedAt: projectedDate.toISOString(),
        averageSoundLevel: null,
        classification: "unknown",
        measurementsCount: 0,
        confidence: "insufficient",
      };
    }

    const averageSoundLevel =
      historicalData.totalSoundLevel / historicalData.count;

    return {
      hour,
      projectedAt: projectedDate.toISOString(),
      averageSoundLevel,
      classification: classifyProjectedLevel(averageSoundLevel),
      measurementsCount: historicalData.count,
      confidence: getConfidence(historicalData.count),
    };
  });
}
function calculateAmbianceHistory(location, measurements) {
  const normalizedLocation = normalize(location);

  return measurements.filter(
    (measurement) =>
      measurement.deviceId &&
      measurement.deviceId.location &&
      normalize(measurement.deviceId.location) === normalizedLocation
  );
}

module.exports = {
  normalize,
  classifyAmbianceRelative,
  classifyProjectedLevel,
  getConfidence,
  calculateAmbianceSummary,
  calculateQuietHours,
  calculateAmbianceForecast,
  calculateAmbianceHistory,
};