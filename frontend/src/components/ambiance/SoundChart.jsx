import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="sound-chart-tooltip">
      <p className="fw-semibold mb-1">{label}</p>
      <p className="mb-0">
        Niveau sonore : {payload[0].value.toFixed(2)}
      </p>
    </div>
  );
}

function SoundChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="ambiance-card p-4">
        <h2 className="h4 fw-bold mb-2">
          Évolution de l’ambiance
        </h2>

        <p className="text-secondary mb-0">
          Aucune donnée historique n’est disponible.
        </p>
      </div>
    );
  }

  return (
    <section className="ambiance-card sound-chart-card p-4">
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-2">
          Évolution de l’ambiance
        </h2>

        <p className="text-secondary mb-0">
          Variation du niveau sonore pendant la période observée.
        </p>
      </div>

      <div className="sound-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 18,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#dfe7e5"
            />

            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#687774", fontSize: 12 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#687774", fontSize: 12 }}
              width={48}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="soundLevel"
              stroke="var(--ambiance-primary)"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#ffffff",
                stroke: "var(--ambiance-primary)",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "var(--ambiance-primary)",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="small text-secondary mt-3 mb-0">
        Les valeurs affichées proviennent de la mesure non calibrée fournie par
        Phyphox.
      </p>
    </section>
  );
}

export default SoundChart;