'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Recipe {
  id: number;
  title: string;
  description: string;
}

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
  const [hydrated, setHydrated] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const fetchRecipes = (q?: string) => {
    setLoading(true);
    fetch(`http://localhost:3000/recipes${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      .then(res => res.json())
      .then(data => setRecipes(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setSearchValue('');
    setHydrated(true);
    setIsAuth(!!localStorage.getItem('token'));
    fetchRecipes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchValue || '');
    fetchRecipes(searchValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
    window.location.href = '/';
  };

  if (!hydrated) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Всі рецепти</h1>
      <Card className="mb-4">
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Пошук за назвою..."
              value={searchValue ?? ''}
              onChange={e => setSearchValue(e.target.value)}
              className="w-full"
            />
            <Button type="submit">Пошук</Button>
          </form>
        </CardContent>
      </Card>
      <div className="mb-4 flex gap-4 flex-wrap justify-center">
        {isAuth ? (
          <>
            <Link href="/add-recipe">
              <Button variant="default">Додати рецепт</Button>
            </Link>
            <Link href="/my-recipes">
              <Button variant="secondary">Мої рецепти</Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout}>Вийти</Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="default">Додати рецепт</Button>

          </Link>
        )}
      </div>
      {loading ? (
        <div>Завантаження...</div>
      ) : (
        <ul className="flex flex-col gap-4">
          {recipes.map(recipe => (
            <li key={recipe.id} className="border rounded p-4 bg-white dark:bg-black">
              <Link href={`/recipes/${recipe.id}`} className="text-xl font-semibold hover:underline">{recipe.title}</Link>
              <p className="text-gray-600 mt-1">{recipe.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
