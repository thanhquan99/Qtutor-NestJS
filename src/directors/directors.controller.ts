import { DirectorsService } from './directors.service';
import { Director } from './director.entity';
import {
  CreateManyDto,
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Crud({
  model: {
    type: Director,
  },
})
@Controller('directors')
export class DirectorsController implements CrudController<Director> {
  constructor(public service: DirectorsService) {}

  get base(): CrudController<Director> {
    return this;
  }

  @Override('getManyBase')
  getDirectors(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getDirector(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @UseGuards(AuthGuard())
  @Override('createOneBase')
  createDirector(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Director,
  ) {
    return this.base.createOneBase(req, dto);
  }

  @Override('createManyBase')
  @UseGuards(AuthGuard())
  createDirectors(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Director>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  @UseGuards(AuthGuard())
  updateDirector(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Director,
  ) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  @UseGuards(AuthGuard())
  replaceDirector(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Director,
  ) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override('deleteOneBase')
  @UseGuards(AuthGuard())
  deleteDirector(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
