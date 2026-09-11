const styles = {
  Open: 'bg-blue-50 text-blue-700 ring-blue-200',
  'In Progress': 'bg-amber-50 text-amber-700 ring-amber-200',
  Resolved: 'bg-green-50 text-green-700 ring-green-200',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
