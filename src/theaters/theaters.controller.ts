import { Theater } from './theater.entity';
import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { TheatersService } from './theaters.service';

@Crud({
  model: {
    type: Theater,
  },
})
@Controller('theaters')
export class TheatersController implements CrudController<Theater> {
  constructor(public service: TheatersService) {}
}
