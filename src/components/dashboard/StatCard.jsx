const colors = {
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-green-50 text-green-600',
};

export default function StatCard({ label, value, Icon, color = 'blue' }) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-muted">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors[color]}`}>
          <Icon size={18} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
