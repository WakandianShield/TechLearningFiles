import { IsString, IsOptional, IsEnum, IsArray, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectCategory } from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty({ example: 'Data Structures Final Project' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ example: 'Implementation of AVL trees and hash tables' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ enum: ProjectCategory })
  @IsOptional()
  @IsEnum(ProjectCategory)
  category?: ProjectCategory;

  @ApiPropertyOptional({ example: ['algorithms', 'java'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: '2025-2' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  semester?: string;

  @ApiPropertyOptional({ example: 'Computer Science 201' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string;
}
