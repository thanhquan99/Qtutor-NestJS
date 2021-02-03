import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { Cinema } from './cinema.entity';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('cinemas')
export class CinemasController {
  constructor(private cinemaService: CinemasService) {}
  @Post()
  @UsePipes(ValidationPipe)
  createCinema(@Body() createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    return this.cinemaService.createCinema(createCinemaDto);
  }
}
