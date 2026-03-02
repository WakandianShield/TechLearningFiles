import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Public endpoints (no auth)
  @Get('explore')
  @ApiOperation({ summary: 'Explore public projects' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  explore(@Query('category') category?: string, @Query('search') search?: string) {
    return this.projectsService.explore(category, search);
  }

  @Get('public/:id')
  @ApiOperation({ summary: 'Get a public project by ID' })
  findOnePublic(@Param('id') id: string) {
    return this.projectsService.findOnePublic(id);
  }

  // Auth-protected endpoints
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project' })
  create(@Request() req: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(req.user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all projects for current user' })
  @ApiQuery({ name: 'category', required: false })
  findAll(@Request() req: any, @Query('category') category?: string) {
    return this.projectsService.findAll(req.user.id, category);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get project statistics' })
  getStats(@Request() req: any) {
    return this.projectsService.getStats(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a project by ID' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.projectsService.findOne(id, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a project' })
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.projectsService.remove(id, req.user.id);
  }

  @Patch(':id/pin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle project pin status' })
  togglePin(@Request() req: any, @Param('id') id: string) {
    return this.projectsService.togglePin(id, req.user.id);
  }
}
