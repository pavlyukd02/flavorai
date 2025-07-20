import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) { }

  async create(createRecipeDto: CreateRecipeDto, authorId: number) {
    return this.prisma.recipe.create({
      data: { ...createRecipeDto, authorId },
    });
  }

  findAll(q?: string) {
    return this.prisma.recipe.findMany({
      where: q ? { title: { contains: q, mode: 'insensitive' } } : undefined,
      include: { author: true, ratings: true },
    });
  }

  findByAuthor(authorId: number) {
    return this.prisma.recipe.findMany({ where: { authorId }, include: { ratings: true } });
  }

  findOne(id: number) {
    return this.prisma.recipe.findUnique({ where: { id }, include: { author: true, ratings: true } });
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto, userId: number) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe || recipe.authorId !== userId) throw new ForbiddenException('Not allowed');
    return this.prisma.recipe.update({ where: { id }, data: updateRecipeDto });
  }

  async remove(id: number, userId: number) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe || recipe.authorId !== userId) throw new ForbiddenException('Not allowed');

    await this.prisma.rating.deleteMany({ where: { recipeId: id } });
    return this.prisma.recipe.delete({ where: { id } });
  }
}
