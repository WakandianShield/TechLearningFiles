'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, LayoutDashboard, FolderOpen, Plus, User, LogOut, Compass, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './Navbar.module.css';

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
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.left}>
            <Link href="/dashboard" className={styles.logo}>
              <BookOpen size={28} className={styles.logoIcon} />
              <span className={cn(styles.logoText, 'gradient-text')}>TechLearning</span>
            </Link>

            <div className={styles.desktopLinks}>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(styles.link, isActive ? styles.linkActive : styles.linkInactive)}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className={styles.right}>
            <Link
              href="/dashboard/settings"
              className={cn(styles.iconBtn, pathname === '/dashboard/settings' && styles.iconBtnActive)}
            >
              <Settings size={16} />
            </Link>
            <Link
              href="/dashboard/profile"
              className={cn(styles.iconBtn, pathname === '/dashboard/profile' && styles.iconBtnActive)}
            >
              <User size={16} />
            </Link>
            <span className={styles.userName}>
              {session?.user?.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className={styles.logoutBtn}
            >
              <LogOut size={16} />
              <span className={styles.logoutLabel}>Salir</span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className={styles.mobileLinks}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(styles.mobileLink, isActive ? styles.mobileLinkActive : styles.mobileLinkInactive)}
              >
                <Icon size={14} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
