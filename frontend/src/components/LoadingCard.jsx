function LoadingCard() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="skeleton h-8 w-3/4 rounded"></div>
      <div className="skeleton h-4 w-1/2 rounded"></div>
      <div className="skeleton h-20 w-full rounded"></div>
      <div className="flex space-x-2">
        <div className="skeleton h-10 w-20 rounded"></div>
        <div className="skeleton h-10 w-20 rounded"></div>
        <div className="skeleton h-10 w-20 rounded"></div>
      </div>
    </div>
  );
}

export default LoadingCard;