import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';
import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  model: {
    type: Movie,
  },
})
@Controller('movies')
export class MoviesController implements CrudController<Movie> {
  constructor(public service: MoviesService) {}
}
