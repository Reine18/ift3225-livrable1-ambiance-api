import { getAmbiancePresentation } from "../../utils/ambiancePresentation";

function AmbianceBadge({ classification, size = "normal" }) {
  const presentation = getAmbiancePresentation(classification);

  return (
    <span
      className={`ambiance-badge ${presentation.statusClass} ambiance-badge-${size}`}
    >
      <span aria-hidden="true">{presentation.icon}</span>
      <span>{presentation.label}</span>
    </span>
  );
}

export default AmbianceBadge;