'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeaderNav() {
  const [isAuth, setIsAuth] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIsAuth(!!localStorage.getItem('token'));
    setHydrated(true);
    window.addEventListener('storage', () => {
      setIsAuth(!!localStorage.getItem('token'));
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
    window.location.href = '/login';
  };

  const handleAuthRequired = (e: React.MouseEvent) => {
    if (!isAuth) {
      e.preventDefault();
      alert('Для доступу до цієї сторінки потрібно авторизуватися');
    }
  };

  if (!hydrated) return null;

  return (
    <header className="w-full bg-white dark:bg-black border-b mb-8">
      <nav className="max-w-2xl mx-auto flex gap-4 py-4 px-4">
        <Link href="/" className="font-bold text-lg">FlavorAI</Link>
        <Link href="/add-recipe" className="hover:underline" onClick={handleAuthRequired}>Додати рецепт</Link>
        <Link href="/my-recipes" className="hover:underline" onClick={handleAuthRequired}>Мої рецепти</Link>
        <div className="ml-auto flex gap-4">
          {!isAuth && <Link href="/login" className="hover:underline">Увійти</Link>}
          {!isAuth && <Link href="/register" className="hover:underline">Реєстрація</Link>}
          {isAuth && <button onClick={handleLogout} className="hover:underline text-gray-600">Вийти</button>}
        </div>
      </nav>
    </header>
  );
} 