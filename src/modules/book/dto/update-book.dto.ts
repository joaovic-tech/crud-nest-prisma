import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { Exclude } from 'class-transformer';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
