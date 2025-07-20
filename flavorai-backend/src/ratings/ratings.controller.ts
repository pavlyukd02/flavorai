import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) { }

  @Post()
  create(@Body() createRatingDto: CreateRatingDto, @Request() req) {
    return this.ratingsService.create(createRatingDto, req.user.userId);
  }

  @Get('my')
  findMy(@Request() req) {
    return this.ratingsService.findByUser(req.user.userId);
  }

  @Get('recipe/:recipeId')
  findByRecipe(@Param('recipeId') recipeId: string) {
    return this.ratingsService.findByRecipe(+recipeId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto, @Request() req) {
    return this.ratingsService.update(+id, updateRatingDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.ratingsService.remove(+id, req.user.userId);
  }
}
