import { Headset, CircleUser } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white lg:hidden">
          <Headset size={18} aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink lg:hidden">SupportDesk</p>
          <h1 className="hidden text-base font-semibold text-ink lg:block">Support Dashboard</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-ink-muted sm:block">agent@supportdesk.io</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary">
          <CircleUser size={20} aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
