import { UpdateCinemaDto } from './dto/update-cinema-dto';
import { CinemasFilterDto } from './dto/get-cinemas-filter.dto';
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { Cinema } from './cinema.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('cinemas')
export class CinemasController {
  constructor(private cinemaService: CinemasService) {}

  @Get('/:id')
  getCinema(@Param('id', ParseIntPipe) id: number): Promise<Cinema> {
    return this.cinemaService.getCinemaById(id);
  }

  @Get()
  getCinemas(
    @Query(ValidationPipe) filterDto: CinemasFilterDto,
  ): Promise<Cinema[]> {
    return this.cinemaService.getCinemas(filterDto);
  }

  @Post()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  createCinema(
    @Body() createCinemaDto: CreateCinemaDto,
    @GetUser() user: User,
  ): Promise<Cinema> {
    console.log(user);
    return this.cinemaService.createCinema(createCinemaDto);
  }

  @Delete('/:id')
  deleteCinemaById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cinemaService.deleteCinemaById(id);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateCinema(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCinemaDto: UpdateCinemaDto,
  ): Promise<Cinema> {
    return this.cinemaService.updateCinema(id, updateCinemaDto);
  }
}
