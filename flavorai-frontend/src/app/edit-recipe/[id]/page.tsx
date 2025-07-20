"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function EditRecipePage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    if (!id) return;
    fetch(`http://localhost:3000/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setIngredients(data.ingredients || "");
        setInstructions(data.instructions || "");
      })
      .catch(() => setError("Ошибка загрузки рецепта"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`http://localhost:3000/recipes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ title, description, ingredients, instructions }),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      router.push(`/recipes/${id}`);
    } catch (err: any) {
      setError(err.message || "Ошибка сохранения");
    }
  };

  if (!hydrated) return null;
  if (loading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Редагувати рецепт</CardTitle>
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
                onChange={(e) => setTitle(e.target.value)}
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
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="ingredients">Інгредієнти</Label>
              <textarea
                id="ingredients"
                placeholder="Інгредієнти"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                required
                className="w-full min-h-[80px] border rounded p-2 mt-1 bg-transparent"
              />
            </div>
            <div>
              <Label htmlFor="instructions">Інструкція</Label>
              <textarea
                id="instructions"
                placeholder="Інструкція"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                className="w-full min-h-[180px] border rounded p-2 mt-1 bg-transparent"
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full">Зберегти</Button>
            <Button type="button" variant="secondary" className="w-full" onClick={() => router.push(`/recipes/${id}`)}>Скасувати</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 