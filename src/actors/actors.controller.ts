import { ActorsService } from './actors.service';
import { Actor } from './actor.entity';
import { Controller, UseGuards } from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { AuthGuard } from '@nestjs/passport';

@Crud({
  model: {
    type: Actor,
  },
  routes: {
    only: [
      'getManyBase',
      'getOneBase',
      'createOneBase',
      'updateOneBase',
      'deleteOneBase',
    ],
  },
})
@Controller('actors')
export class ActorsController implements CrudController<Actor> {
  constructor(public service: ActorsService) {}

  get base(): CrudController<Actor> {
    return this;
  }

  @Override('getManyBase')
  getActors(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getActor(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @UseGuards(AuthGuard())
  @Override('createOneBase')
  createActor(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Actor) {
    return this.base.createOneBase(req, dto);
  }

  @Override('updateOneBase')
  @UseGuards(AuthGuard())
  updateActor(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Actor) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('deleteOneBase')
  @UseGuards(AuthGuard())
  deleteActor(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
