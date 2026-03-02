import {
  Controller, Get, Put, Post, Body, Param, Query,
  UseGuards, UseInterceptors, UploadedFile, Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.update(req.user.id, dto);
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload avatar image' })
  async uploadAvatar(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    const avatarPath = `/uploads/${file.filename}`;
    await this.usersService.update(req.user.id, { avatar: avatarPath });
    return { avatar: avatarPath };
  }

  @Post('banner')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload banner image' })
  async uploadBanner(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    const bannerPath = `/uploads/${file.filename}`;
    await this.usersService.update(req.user.id, { banner: bannerPath });
    return { banner: bannerPath };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users' })
  @ApiQuery({ name: 'q', required: true })
  searchUsers(@Query('q') query: string) {
    return this.usersService.searchUsers(query || '');
  }

  @Get(':id/public')
  @ApiOperation({ summary: 'Get public user profile' })
  getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @Get(':id/projects')
  @ApiOperation({ summary: 'Get public projects for a user' })
  @ApiQuery({ name: 'category', required: false })
  getPublicProjects(@Param('id') id: string, @Query('category') category?: string) {
    return this.usersService.getPublicProjects(id, category);
  }
}
