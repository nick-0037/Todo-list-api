import { IsOptional, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class UpdateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
