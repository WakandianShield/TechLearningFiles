import { IsString, IsOptional, MaxLength, IsUrl, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Computer Science student' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({ example: 'https://mywebsite.com' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  website?: string;

  @ApiPropertyOptional({ example: { github: 'user', linkedin: 'user', twitter: 'user' } })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;
}
