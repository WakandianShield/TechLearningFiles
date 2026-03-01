import {
  Controller, Post, Get, Delete, Param, Query,
  UseGuards, UseInterceptors, UploadedFiles,
  Request, Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags, ApiOperation, ApiBearerAuth,
  ApiConsumes, ApiBody, ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesService } from './files.service';

@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/:projectId')
  @UseInterceptors(FilesInterceptor('files', 20))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload files to a project (max 20 files, 100MB each)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        description: { type: 'string' },
      },
    },
  })
  uploadFiles(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('description') description?: string,
  ) {
    return this.filesService.uploadFiles(projectId, req.user.id, files, description);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all files for a project' })
  @ApiQuery({ name: 'fileType', required: false })
  getProjectFiles(
    @Request() req: any,
    @Param('projectId') projectId: string,
    @Query('fileType') fileType?: string,
  ) {
    return this.filesService.getProjectFiles(projectId, req.user.id, fileType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file details by ID' })
  getFile(@Request() req: any, @Param('id') id: string) {
    return this.filesService.getFile(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file' })
  deleteFile(@Request() req: any, @Param('id') id: string) {
    return this.filesService.deleteFile(id, req.user.id);
  }
}
