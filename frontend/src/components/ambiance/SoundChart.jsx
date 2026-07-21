import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;
  const level = Number(item?.averageSoundLevel);
  const count = Number(item?.count) || 0;

  return (
    <div className="sound-chart-tooltip">
      <p className="fw-semibold mb-1">{label}</p>

      <p className="mb-1">
        Niveau moyen :{" "}
        {Number.isFinite(level)
          ? level.toFixed(2)
          : "Indisponible"}
      </p>

      <p className="small text-secondary mb-0">
        Basé sur {count} {count > 1 ? "mesures" : "mesure"}
      </p>
    </div>
  );
}

function SoundChart({ data = [] }) {
  const hourlyMap = new Map(
    data
      .filter(
        (item) =>
          Number.isFinite(Number(item.hour)) &&
          Number.isFinite(Number(item.averageSoundLevel))
      )
      .map((item) => [
        Number(item.hour),
        {
          hour: Number(item.hour),
          hourLabel: `${Number(item.hour)} h`,
          averageSoundLevel: Number(item.averageSoundLevel),
          count: Number(item.count) || 0,
        },
      ])
  );

  const chartData = Array.from({ length: 24 }, (_, hour) => {
    const existingHour = hourlyMap.get(hour);

    return (
      existingHour ?? {
        hour,
        hourLabel: `${hour} h`,
        averageSoundLevel: null,
        count: 0,
      }
    );
  });

  const availableData = chartData.filter(
    (item) => item.averageSoundLevel !== null
  );

  if (availableData.length === 0) {
    return (
      <section className="ambiance-card p-4">
        <h2 className="h4 fw-bold mb-2">
          Ambiance habituelle selon l’heure
        </h2>

        <p className="text-secondary mb-0">
          Aucune donnée horaire n’est encore disponible pour ce lieu.
        </p>
      </section>
    );
  }

  const minimumLevel = Math.min(
    ...availableData.map((item) => item.averageSoundLevel)
  );

  const calmThreshold = minimumLevel + 5;

  const calmHours = availableData.filter(
    (item) => item.averageSoundLevel <= calmThreshold
  );

  const calmStart =
    calmHours.length > 0
      ? Math.min(...calmHours.map((item) => item.hour))
      : null;

  const calmEnd =
    calmHours.length > 0
      ? Math.max(...calmHours.map((item) => item.hour))
      : null;

  const bestHour = availableData.reduce((best, current) =>
    current.averageSoundLevel < best.averageSoundLevel
      ? current
      : best
  );



  return (
    <section className="ambiance-card sound-chart-card p-4">
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-2">
          Ambiance habituelle selon l’heure
        </h2>

        <p className="text-secondary mb-0">
          Niveau sonore moyen observé pour chaque heure de la journée.
          Les valeurs plus faibles indiquent les moments les plus propices
          à l’étude.
        </p>
      </div>

      <div className="alert alert-success mb-4">
        <strong>Meilleure heure observée :</strong>{" "}
        {bestHour.hourLabel}, avec un niveau moyen de{" "}
        {bestHour.averageSoundLevel.toFixed(1)}.
      </div>

      <div className="sound-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 15,
              right: 20,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#dfe7e5"
            />

            {calmStart !== null && calmEnd !== null && (
              <ReferenceArea
                x1={`${calmStart} h`}
                x2={`${calmEnd} h`}
                fill="var(--ambiance-primary)"
                fillOpacity={0.1}
                label={{
                  value: "Période la plus propice à l’étude",
                  position: "insideTop",
                  fill: "#3d7f68",
                  fontSize: 12,
                }}
              />
            )}

            <XAxis
              dataKey="hourLabel"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#687774",
                fontSize: 12,
              }}
            />

            <YAxis
              domain={["dataMin - 3", "dataMax + 3"]}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#687774",
                fontSize: 12,
              }}
              width={48}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="averageSoundLevel"
              stroke="var(--ambiance-primary)"
              strokeWidth={3}
              connectNulls={false}
              dot={{
                r: 5,
                fill: "#ffffff",
                stroke: "var(--ambiance-primary)",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: "var(--ambiance-primary)",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="small text-secondary mt-3 mb-0">
        Cette tendance est calculée à partir de toutes les mesures
        historiques disponibles pour chaque heure. Elle deviendra plus
        représentative à mesure que les collectes Phyphox s’accumuleront.
      </p>
    </section>
  );
}

export default SoundChart;