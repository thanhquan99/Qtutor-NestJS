import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BaseControllerCRUD } from 'src/base/base-controller-CRUD';
import { Permissions } from 'src/guards/permissions.decorator';
import { PermissionAction } from 'src/permissions/permission.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Rating } from './ratings.entity';
import { RatingsService } from './ratings.service';

@Controller('ratings')
export class RatingsController extends BaseControllerCRUD<Rating> {
    constructor(service:RatingsService){
        super(service);
    }

    @Post()
    @UseGuards(AuthGuard())
    @UsePipes(ValidationPipe)
    createOne(@Body() createDto: CreateRatingDto): Promise<Rating> {
      return this.service.createOne(createDto);
    }
}
