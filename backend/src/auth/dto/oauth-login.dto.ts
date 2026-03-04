import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OAuthLoginDto {
  @ApiProperty({ example: 'usuario@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Santiago' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'google' })
  @IsString()
  provider: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  providerAccountId: string;

  @ApiProperty({ example: 'https://lh3.googleusercontent.com/a/photo', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}
