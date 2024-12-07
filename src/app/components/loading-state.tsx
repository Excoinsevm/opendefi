export function LoadingState() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="bg-gray-200 h-32 rounded-lg" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}
