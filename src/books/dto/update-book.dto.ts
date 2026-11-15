import { PartialType } from "@nestjs/mapped-types";
import { IsInt, IsOptional, IsString, Min } from "class-validator";
import { CreateBookDto } from "./create-book.dto";

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalCopies?: number;

  @IsOptional()
  @IsString()
  genreId?: string;
}
