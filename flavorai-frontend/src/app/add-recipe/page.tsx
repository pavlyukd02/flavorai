'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function AddRecipePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ title, description, ingredients, instructions }),
      });
      if (!res.ok) throw new Error('Ошибка добавления рецепта');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Додати рецепт</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="title">Назва</Label>
              <Input
                id="title"
                type="text"
                placeholder="Назва"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Опис</Label>
              <Input
                id="description"
                type="text"
                placeholder="Опис"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="ingredients">Інгредієнти</Label>
              <textarea
                id="ingredients"
                placeholder="Інгредієнти"
                value={ingredients}
                onChange={e => setIngredients(e.target.value)}
                className="border p-2 rounded w-full min-h-[60px]"
                required
              />
            </div>
            <div>
              <Label htmlFor="instructions">Інструкція</Label>
              <textarea
                id="instructions"
                placeholder="Інструкція"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                className="border p-2 rounded w-full min-h-[180px]"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full">Додати</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 