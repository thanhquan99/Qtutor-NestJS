import { UpdateGenreDto } from './dto/update-genre.dto';
import { PermissionAction } from './../permissions/permission.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { GenresService } from './genres.service';
import { Genre } from './genre.entity';
import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Permissions } from 'src/guards/permissions.decorator';

@Controller('genres')
export class GenresController extends BaseControllerCRUD<Genre> {
  constructor(public service: GenresService) {
    super(service);
  }

  @Post()
  @Permissions(PermissionAction.CREATE_GENRE)
  @UsePipes(ValidationPipe)
  createOne(@Body() createDto: CreateGenreDto) {
    return this.service.createOne(createDto);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  @Permissions(PermissionAction.UPDATE_GENRE)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateGenreDto,
  ) {
    return this.service.updateOne(id, updateDto);
  }

  @Delete('/:id')
  @Permissions(PermissionAction.DELETE_GENRE)
  deleteDirector(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteOne(id);
  }
}
