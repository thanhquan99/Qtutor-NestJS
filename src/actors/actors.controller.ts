import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateActorDto } from './dto/updateActor.dto';
import { CreateActorDto } from './dto/createActor.dto';
import { ActorsService } from './actors.service';
import { Actor } from './actor.entity';
import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { PermissionAction } from 'src/permissions/permission.entity';
import { Permissions } from 'src/guards/permissions.decorator';

@Controller('actors')
export class ActorsController extends BaseControllerCRUD<Actor> {
  constructor(service: ActorsService) {
    super(service);
  }

  @Post()
  @ApiBearerAuth()
  @Permissions(PermissionAction.CREATE_ACTOR)
  @UsePipes(ValidationPipe)
  createOne(@Body() createActorDto: CreateActorDto): Promise<Actor> {
    return this.service.createOne(createActorDto);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.UPDATE_ACTOR)
  @UsePipes(ValidationPipe)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() createActorDto: UpdateActorDto,
  ): Promise<Actor> {
    return this.service.updateOne(id, createActorDto);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @Permissions(PermissionAction.DELETE_ACTOR)
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.service.deleteOne(id);
  }
}
