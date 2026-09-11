import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';

const styles = {
  Low: { classes: 'bg-green-50 text-green-700 ring-green-200', Icon: ArrowDown },
  Medium: { classes: 'bg-amber-50 text-amber-700 ring-amber-200', Icon: ArrowRight },
  High: { classes: 'bg-red-50 text-red-700 ring-red-200', Icon: ArrowUp },
};

export default function PriorityBadge({ priority }) {
  const { classes, Icon } = styles[priority];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${classes}`}
    >
      <Icon size={12} aria-hidden="true" />
      {priority}
    </span>
  );
}
