import { GenresService } from './genres.service';
import { Genre } from './genre.entity';
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
    type: Genre,
  },
})
@Controller('genres')
export class GenresController implements CrudController<Genre> {
  constructor(public service: GenresService) {}

  get base(): CrudController<Genre> {
    return this;
  }

  @Override('getManyBase')
  getGenres(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override('getOneBase')
  getGenre(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @UseGuards(AuthGuard())
  @Override('createOneBase')
  createGenre(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Genre) {
    return this.service.createGenre(dto);
  }

  @Override('createManyBase')
  @UseGuards(AuthGuard())
  createGenres(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Genre>,
  ) {
    return this.base.createManyBase(req, dto);
  }

  @Override('updateOneBase')
  @UseGuards(AuthGuard())
  updateGenre(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Genre) {
    return this.base.updateOneBase(req, dto);
  }

  @Override('replaceOneBase')
  @UseGuards(AuthGuard())
  replaceGenre(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: Genre) {
    return this.base.replaceOneBase(req, dto);
  }

  @Override('deleteOneBase')
  @UseGuards(AuthGuard())
  deleteDirector(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req);
  }
}
