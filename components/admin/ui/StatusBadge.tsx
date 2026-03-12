import { cn } from "@/lib/utils/cn";

const statusColors: Record<string, string> = {
  // Order statuses
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  paid: "bg-green-500/10 text-green-500 border-green-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  refunded: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  // Generic statuses
  published: "bg-green-500/10 text-green-500 border-green-500/20",
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

interface StatusBadgeProps {
  status: string;
  labels?: Record<string, string>;
  className?: string;
}

export function StatusBadge({ status, labels, className }: StatusBadgeProps) {
  const colorClass = statusColors[status] || statusColors.pending;
  const displayLabel = labels?.[status] || status;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap",
        colorClass,
        className
      )}
    >
      {displayLabel}
    </span>
  );
}
