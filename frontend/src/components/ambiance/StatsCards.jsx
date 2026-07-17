import { Col, Row } from "react-bootstrap";

const statConfig = [
  {
    key: "total",
    icon: "📍",
    label: "Lieux suivis",
    description: "Espaces actuellement disponibles",
    className: "stat-total",
  },
  {
    key: "calm",
    icon: "🪷",
    label: "Lieux calmes",
    description: "Propices à la concentration",
    className: "stat-calm",
  },
  {
    key: "moderate",
    icon: "💬",
    label: "Lieux modérés",
    description: "Quelques échanges et déplacements",
    className: "stat-moderate",
    },
  {
    key: "animated",
    icon: "📣",
    label: "Lieux animés",
    description: "Environnements plus dynamiques",
    className: "stat-animated",
  },
];

function StatsCards({ locations = [] }) {
  const counts = locations.reduce(
    (result, location) => {
      result.total += 1;

      if (Object.hasOwn(result, location.classification)) {
        result[location.classification] += 1;
      }

      return result;
    },
    {
      total: 0,
      calm: 0,
      moderate: 0,
      animated: 0,
    }
  );

  return (
    <Row className="g-3">
      {statConfig.map((stat) => (
        <Col key={stat.key} xs={12} sm={6} xl={3}>
          <article className={`ambiance-stat-card ${stat.className}`}>
            <div className="ambiance-stat-icon" aria-hidden="true">
              {stat.icon}
            </div>

            <div>
              <p className="ambiance-stat-value mb-1">
                {counts[stat.key]}
              </p>

              <h3 className="h6 fw-bold mb-1">
                {stat.label}
              </h3>

              <p className="small mb-0 ambiance-stat-description">
                {stat.description}
              </p>
            </div>
          </article>
        </Col>
      ))}
    </Row>
  );
}

export default StatsCards;