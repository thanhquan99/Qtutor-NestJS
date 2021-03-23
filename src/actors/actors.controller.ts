import { ActorsService } from './actors.service';
import { Actor } from './actor.entity';
import { Controller, UseGuards } from '@nestjs/common';
import {
  CreateManyDto,
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

  @Override('createManyBase')
  @UseGuards(AuthGuard())
  createActors(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Actor>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  @UseGuards(AuthGuard())
  updateActor(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Actor) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  @UseGuards(AuthGuard())
  replaceActor(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Actor) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override('deleteOneBase')
  @UseGuards(AuthGuard())
  deleteActor(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
