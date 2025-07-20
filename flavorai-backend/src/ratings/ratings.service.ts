import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) { }

  async create(createRatingDto: CreateRatingDto, userId: number) {

    const existing = await this.prisma.rating.findFirst({
      where: { userId, recipeId: createRatingDto.recipeId },
    });
    if (existing) {

      return this.prisma.rating.update({
        where: { id: existing.id },
        data: { value: createRatingDto.value },
      });
    }
    return this.prisma.rating.create({
      data: { ...createRatingDto, userId },
    });
  }

  findByUser(userId: number) {
    return this.prisma.rating.findMany({ where: { userId }, include: { recipe: true } });
  }

  findByRecipe(recipeId: number) {
    return this.prisma.rating.findMany({ where: { recipeId }, include: { user: true } });
  }

  async update(id: number, updateRatingDto: UpdateRatingDto, userId: number) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    if (!rating || rating.userId !== userId) throw new ForbiddenException('Not allowed');
    return this.prisma.rating.update({ where: { id }, data: updateRatingDto });
  }

  async remove(id: number, userId: number) {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    if (!rating || rating.userId !== userId) throw new ForbiddenException('Not allowed');
    return this.prisma.rating.delete({ where: { id } });
  }
}
