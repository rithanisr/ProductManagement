const StatCard = ({ label, value, tone = "primary", icon = "•", hint }) => {
  const toneColors = {
    primary: { bg: "#f0f7ff", color: "#0d6efd", border: "#0d6efd" },
    success: { bg: "#e8f5e9", color: "#198754", border: "#198754" },
    dark: { bg: "#f8f9fa", color: "#212529", border: "#212529" },
    info: { bg: "#e0f2fe", color: "#0dcaf0", border: "#0dcaf0" },
    warning: { bg: "#fff3cd", color: "#ffc107", border: "#ffc107" },
  };

  const currentTone = toneColors[tone] || toneColors.primary;

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: `1px solid ${currentTone.border}22`,
        padding: "24px",
        height: "100%",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <p
            style={{
              color: "#6c757d",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {label}
          </p>
          <strong
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#212529",
              display: "block",
            }}
          >
            {value}
          </strong>
          {hint && (
            <small style={{ color: "#6c757d", fontSize: "13px" }}>{hint}</small>
          )}
        </div>
        <div
          style={{
            width: "56px",
            height: "56px",
            backgroundColor: currentTone.bg,
            color: currentTone.color,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
