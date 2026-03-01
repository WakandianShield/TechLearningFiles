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
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(@Request() req: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects for current user' })
  @ApiQuery({ name: 'category', required: false })
  findAll(@Request() req: any, @Query('category') category?: string) {
    return this.projectsService.findAll(req.user.id, category);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get project statistics' })
  getStats(@Request() req: any) {
    return this.projectsService.getStats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.projectsService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a project' })
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.projectsService.remove(id, req.user.id);
  }

  @Patch(':id/pin')
  @ApiOperation({ summary: 'Toggle project pin status' })
  togglePin(@Request() req: any, @Param('id') id: string) {
    return this.projectsService.togglePin(id, req.user.id);
  }
}
