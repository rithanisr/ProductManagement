const StatCard = ({ label, value, tone = "primary", icon = "•", hint }) => {
  return (
    <div className={`card stat-card shadow-sm p-3 ${tone}`}>
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div>
          <p className="text-muted mb-2">{label}</p>
          <strong className="d-block fs-4">{value}</strong>
          {hint && <small className="text-muted">{hint}</small>}
        </div>
        <div className={`stat-icon ${tone}`}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
