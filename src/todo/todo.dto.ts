import { IsOptional, IsString } from 'class-validator';

export class createDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class updateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
