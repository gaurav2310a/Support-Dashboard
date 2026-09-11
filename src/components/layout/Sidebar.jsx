import { Headset, LayoutDashboard, Tickets, Settings, LifeBuoy } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', Icon: LayoutDashboard, active: true },
  { label: 'Tickets', Icon: Tickets, active: false },
  { label: 'Settings', Icon: Settings, active: false },
  { label: 'Help Center', Icon: LifeBuoy, active: false },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-white lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-line px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
          <Headset size={16} aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold text-ink">SupportDesk</span>
      </div>

      <nav aria-label="Main navigation" className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map(({ label, Icon, active }) => (
            <li key={label}>
              <a
                href="#"
                aria-current={active ? 'page' : undefined}
                onClick={(e) => e.preventDefault()}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? 'bg-primary-light/60 text-primary' : 'text-ink-muted hover:bg-surface hover:text-ink'
                }`}
              >
                <Icon size={17} aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="px-5 pb-4 text-xs text-ink-muted">v1.0.0</p>
    </aside>
  );
}
