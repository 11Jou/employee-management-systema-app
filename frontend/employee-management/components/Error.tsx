import { AlertCircle } from "lucide-react";

interface ErrorProps {
  message?: string;
}

export default function Error({ message = "Unexpected error occurred" }: ErrorProps) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
      <AlertCircle className="h-5 w-5 mt-0.5" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
