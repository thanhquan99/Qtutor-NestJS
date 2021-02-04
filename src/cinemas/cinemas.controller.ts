import { CinemasFilterDto } from './dto/get-cinemas-filter.dto';
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { Cinema } from './cinema.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

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
  @UsePipes(ValidationPipe)
  createCinema(@Body() createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    return this.cinemaService.createCinema(createCinemaDto);
  }
}
