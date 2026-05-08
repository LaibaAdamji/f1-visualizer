function LoadingCard() {
  return (
    <div className="panel p-6 space-y-4 animate-pulse">
      <div className="skeleton h-6 w-24 rounded-full"></div>
      <div className="skeleton h-8 w-3/4 rounded-xl"></div>
      <div className="skeleton h-4 w-1/2 rounded-full"></div>
      <div className="skeleton h-24 w-full rounded-2xl"></div>
      <div className="flex gap-3">
        <div className="skeleton h-10 flex-1 rounded-xl"></div>
        <div className="skeleton h-10 flex-1 rounded-xl"></div>
      </div>
    </div>
  );
}

export default LoadingCard;