const LoadingState = ({ label = "Loading..." }) => {
  return (
    <div className="loading-state py-5 text-center">
      <div className="spinner-border text-secondary" role="status">
        <span className="visually-hidden">{label}</span>
      </div>
      <p className="mt-3 text-muted">{label}</p>
    </div>
  );
};

export default LoadingState;
