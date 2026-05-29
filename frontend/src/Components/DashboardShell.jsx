const DashboardShell = ({ title, subtitle, actions, children }) => {
  return (
    <main className="dashboard-main">
      <div className="dashboard-container">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Product Management</p>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && <div className="page-actions">{actions}</div>}
        </div>
        {children}
      </div>
    </main>
  );
};

export default DashboardShell;
