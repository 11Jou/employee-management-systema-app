interface AvatarProps {
  name?: string;
  title?: string;
}

export default function Avatar({
  name,
  title,
}: AvatarProps) {
  if (typeof window === "undefined" || !name || !title) {
    return null;
  }

  const firstLetter = name?.charAt(0)?.toUpperCase() ?? "A";

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#225199] sm:h-10 sm:w-10">
        <span className="text-sm font-semibold text-white sm:text-lg">
          {firstLetter}
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-xs text-gray-500">{title}</span>
      </div>
    </div>
  );
}
