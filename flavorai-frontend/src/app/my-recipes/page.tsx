'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface Recipe {
  id: number;
  title: string;
  description: string;
}

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:3000/recipes/my', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
    })
      .then(res => res.json())
      .then(data => setRecipes(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цей рецепт?')) return;
    try {
      const res = await fetch(`http://localhost:3000/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      if (!res.ok) throw new Error('Помилка видалення');
      setRecipes(recipes => recipes.filter(r => r.id !== id));
    } catch (err) {
      alert('Помилка видалення');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Мої рецепти</h1>
      <div className="mb-4 flex gap-4">
        <Link href="/add-recipe">
          <Button variant="default">Додати рецепт</Button>
        </Link>
        <Link href="/">
          <Button variant="secondary">Всі рецепти</Button>
        </Link>
      </div>
      {loading ? (
        <div>Завантаження...</div>
      ) : (
        <ul className="flex flex-col gap-4">
          {recipes.map(recipe => (
            <li key={recipe.id}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Link href={`/recipes/${recipe.id}`} className="text-xl font-semibold hover:underline">
                      {recipe.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mt-1">{recipe.description}</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={() => router.push(`/edit-recipe/${recipe.id}`)}>Редагувати</Button>
                    <Button variant="destructive" onClick={() => handleDelete(recipe.id)}>Видалити</Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 