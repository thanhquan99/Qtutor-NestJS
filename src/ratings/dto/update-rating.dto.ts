import { IsNotEmpty, IsString } from "class-validator";

export class UpdateRatingDto {
    @IsNotEmpty()
    @IsString()
    comment: string;
  }