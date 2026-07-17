function SummaryCard({
  icon,
  label,
  value,
  description,
}) {
  return (
    <article className="ambiance-card summary-card p-4">
      <div className="summary-card-icon" aria-hidden="true">
        <i className={`bi ${icon}`} />
      </div>

      <p className="small text-secondary mb-2">
        {label}
      </p>

      <p className="summary-card-value mb-2">
        {value}
      </p>

      {description && (
        <p className="small text-secondary mb-0">
          {description}
        </p>
      )}
    </article>
  );
}

export default SummaryCard;