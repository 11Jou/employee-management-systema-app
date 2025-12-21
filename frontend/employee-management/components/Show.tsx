export interface ShowField {
  label?: string;
  render?: (value: unknown) => React.ReactNode;
  className?: string;
}

interface ShowProps<T extends Record<string, unknown>> {
  data?: T | null;
  fields?: Record<keyof T, ShowField>;
  title?: string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const formatLabel = (key: string): string => {
  return key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export default function Show<T extends Record<string, unknown>>({
  data,
  fields,
  title,
  loading = false,
  emptyMessage = "No data found",
  className = "",
}: ShowProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!data) {
    return <p className="py-10 text-center text-gray-500">{emptyMessage}</p>;
  }

  const keysToShow = fields
    ? (Object.keys(fields) as Array<keyof T>)
    : (Object.keys(data) as Array<keyof T>);

  return (
    <div className={`rounded-lg border bg-white ${className}`}>
      {title && (
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      )}

      <dl className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-2">
        {keysToShow.map((key) => {
          const field = fields?.[key];
          const value = data[key];

          return (
            <div key={String(key)}>
              <dt className="mb-1 text-sm font-medium text-gray-500">
                {field?.label ?? formatLabel(String(key))}
              </dt>
              <dd className={`text-sm text-gray-900 ${field?.className ?? ""}`}>
                {field?.render ? field.render(value) : String(value ?? "-")}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
