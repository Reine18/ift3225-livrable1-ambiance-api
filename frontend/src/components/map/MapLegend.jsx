import { ambiancePresentation } from "../../utils/ambiancePresentation";

const legendOrder = ["calm", "moderate", "animated", "stale"];

function MapLegend() {
  return (
    <section
      className="ambiance-map-legend"
      aria-labelledby="map-legend-title"
    >
      <h3 id="map-legend-title" className="h5 fw-bold mb-3">
        Comprendre les niveaux d’ambiance
      </h3>

      <div className="ambiance-legend-grid">
        {legendOrder.map((classification) => {
          const item = ambiancePresentation[classification];

          return (
            <div
              key={classification}
              className={`ambiance-legend-item ${item.legendClass}`}
            >
              <span className="ambiance-legend-icon" aria-hidden="true">
                {item.icon}
              </span>

              <div>
                <p className="fw-semibold mb-1">{item.label}</p>

                <p className="small mb-0">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default MapLegend;