'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  authorId: number;
}

interface JwtPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}

export default function RecipePage() {
  const { id } = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuth(!!token);
    setHydrated(true);
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.sub);
      } catch { }
    } else {
      setUserId(null);
    }
    if (!id) return;
    fetch(`http://localhost:3000/recipes/${id}`)
      .then(res => res.json())
      .then(data => {
        // Если authorId не приходит напрямую, пробуем достать из data.author.id
        setRecipe({
          ...data,
          authorId: data.authorId ?? (data.author?.id ?? 0),
        });
      })
      .finally(() => setLoading(false));

  }, [id]);

  const handleRate = async (value: number) => {
    if (!isAuth) {
      setError('Только авторизованный пользователь может ставить оценку');
      return;
    }
    setError('');
    try {
      const res = await fetch('http://localhost:3000/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ value, recipeId: Number(id) }),
      });
      if (!res.ok) throw new Error('Ошибка при оценке');
      setMyRating(value);
      localStorage.setItem(`myRating_${id}`, String(value));
    } catch (err: any) {
      setError(err.message || 'Ошибка');
    }
  };

  const handleDelete = async () => {
    if (!isAuth || !recipe) return;
    if (!confirm('Вы уверены, что хотите удалить этот рецепт?')) return;
    try {
      const res = await fetch(`http://localhost:3000/recipes/${recipe.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      if (!res.ok) throw new Error('Ошибка удаления');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления');
    }
  };

  if (!hydrated) return null;
  if (loading) return <div className="p-8">Завантаження...</div>;
  if (!recipe) return <div className="p-8">Рецепт не знайдено</div>;

  const isOwner = userId && recipe.authorId === userId;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-4">{recipe.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-gray-600">{recipe.description}</p>
          <h2 className="text-xl font-semibold mt-6 mb-2">Інгредієнти</h2>
          <div className="whitespace-pre-line mb-4">{recipe.ingredients}</div>
          <h2 className="text-xl font-semibold mb-2">Інструкція</h2>
          <div className="whitespace-pre-line mb-4">{recipe.instructions}</div>
          {isOwner && (
            <div className="flex gap-2 mb-4">
              <Button variant="outline" onClick={() => router.push(`/edit-recipe/${recipe.id}`)}>Редагувати</Button>
              <Button variant="destructive" onClick={handleDelete}>Видалити</Button>
            </div>
          )}
          <div className="my-6">
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map(star => (
                <Button
                  key={star}
                  type="button"
                  variant="ghost"
                  className={'text-2xl px-2 ' + (myRating && myRating >= star ? 'text-yellow-400' : 'text-gray-400')}
                  onClick={() => handleRate(star)}
                  aria-label={`Оцінити на ${star}`}
                  disabled={!isAuth}
                >★</Button>
              ))}
              {myRating && <span className="ml-2 text-sm text-gray-600">Ваша оцінка: {myRating}</span>}
            </div>
            {!isAuth && <div className="text-gray-500 text-sm mt-2">Тільки авторизований користувач може ставити оцінку</div>}
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
          <a href="/" className="text-blue-600 hover:underline">← До списку рецептів</a>
        </CardContent>
      </Card>
    </div>
  );
} 