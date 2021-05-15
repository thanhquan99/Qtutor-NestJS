import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseServiceCRUD } from 'src/base/base-service-CRUD';
import { Movie } from 'src/movies/movie.entity';
import { User } from 'src/users/user.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Rating } from './ratings.entity';

@Injectable()
export class RatingsService extends BaseServiceCRUD<Rating> {
  constructor(@InjectRepository(Rating) repo) {
    super(repo, Rating, 'rating');
  }

  async createOne(createRatingDto: CreateRatingDto) {
    const { comment, movieId, userId } = createRatingDto;
    const movie = await Movie.findOne(movieId);
    if (!movie) {
      throw new NotFoundException('Movie not found!');
    }
    const user = await User.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const rating = Rating.create({ comment, movie, user });
    return rating.save();
  }
}
