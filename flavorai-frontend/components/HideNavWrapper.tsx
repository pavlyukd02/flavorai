'use client';
import { usePathname } from 'next/navigation';
import HeaderNav from './HeaderNav';

export default function HideNavWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname === '/login' || pathname === '/register';
  return (
    <>
      {!hideNav && <HeaderNav />}
      <main>{children}</main>
    </>
  );
} 