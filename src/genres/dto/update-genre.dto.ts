import { PartialType } from "@nestjs/mapped-types";
import { IsOptional, IsString } from "class-validator";
import { CreateGenreDto } from "./create-genre.dto";

export class UpdateGenreDto extends PartialType(CreateGenreDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
