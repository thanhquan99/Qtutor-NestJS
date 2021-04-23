import { UpdateDirectorDto } from './dto/update-director.dto';
import { PermissionAction } from './../permissions/permission.entity';
import { Permissions } from 'src/guards/permissions.decorator';
import { CreateActorDto } from './../actors/dto/createActor.dto';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { DirectorsService } from './directors.service';
import { Director } from './director.entity';
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

@Controller('directors')
export class DirectorsController extends BaseControllerCRUD<Director> {
  constructor(public service: DirectorsService) {
    super(service);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @Permissions(PermissionAction.CREATE_DIRECTOR)
  createOne(@Body() createDto: CreateActorDto): Promise<Director> {
    return this.service.createOne(createDto);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  @Permissions(PermissionAction.UPDATE_DIRECTOR)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDirectorDto,
  ): Promise<Director> {
    return this.service.updateOne(id, updateDto);
  }

  @Delete('/:id')
  @Permissions(PermissionAction.DELETE_DIRECTOR)
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void | { message: string }> {
    return this.service.deleteOne(id);
  }
}
