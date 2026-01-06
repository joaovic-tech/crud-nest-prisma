import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsBoolean,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  author: string;

  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  pageNumbers: number;

  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;
}
