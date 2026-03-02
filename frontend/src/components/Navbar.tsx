'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, LayoutDashboard, FolderOpen, Plus, User, LogOut, Compass, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/projects', label: 'Proyectos', icon: FolderOpen },
  { href: '/dashboard/projects/new', label: 'Nuevo', icon: Plus },
  { href: '/explore', label: 'Explorar', icon: Compass },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-accent-cyan/10" style={{
      background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(20, 20, 20, 0.9))',
      backdropFilter: 'blur(12px)',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <BookOpen className="h-7 w-7 text-accent-cyan group-hover:drop-shadow-[0_0_8px_rgba(100,255,218,0.5)] transition-all" />
              <span className="text-lg font-bold hidden sm:block gradient-text">TechLearning</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                      isActive
                        ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                        : 'text-gray-400 hover:text-accent-cyan hover:bg-white/5',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/settings"
              className={cn(
                'p-2 rounded-xl transition-all duration-300',
                pathname === '/dashboard/settings'
                  ? 'text-accent-cyan bg-accent-cyan/10'
                  : 'text-gray-400 hover:text-accent-cyan hover:bg-white/5',
              )}
            >
              <Settings className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/profile"
              className={cn(
                'p-2 rounded-xl transition-all duration-300',
                pathname === '/dashboard/profile'
                  ? 'text-accent-cyan bg-accent-cyan/10'
                  : 'text-gray-400 hover:text-accent-cyan hover:bg-white/5',
              )}
            >
              <User className="h-4 w-4" />
            </Link>
            <span className="text-sm text-gray-400 hidden sm:block">
              {session?.user?.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent-red transition-colors p-2 rounded-xl hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Salir</span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-1 pb-3 overflow-x-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all',
                  isActive
                    ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                    : 'text-gray-500 hover:text-accent-cyan hover:bg-white/5',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
