import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  private detectFileType(mimeType: string): FileType {
    if (mimeType === 'application/pdf') return FileType.PDF;
    if (mimeType.startsWith('image/')) return FileType.IMAGE;
    if (mimeType.startsWith('video/')) return FileType.VIDEO;
    if (mimeType.startsWith('audio/')) return FileType.AUDIO;
    if (
      mimeType.includes('word') ||
      mimeType.includes('document') ||
      mimeType === 'text/plain' ||
      mimeType === 'application/rtf'
    )
      return FileType.DOCUMENT;
    if (
      mimeType.includes('spreadsheet') ||
      mimeType.includes('excel') ||
      mimeType === 'text/csv'
    )
      return FileType.SPREADSHEET;
    if (
      mimeType.includes('zip') ||
      mimeType.includes('rar') ||
      mimeType.includes('tar') ||
      mimeType.includes('7z') ||
      mimeType.includes('compressed')
    )
      return FileType.ARCHIVE;
    if (
      mimeType.includes('javascript') ||
      mimeType.includes('json') ||
      mimeType.includes('xml') ||
      mimeType.includes('html') ||
      mimeType.includes('css') ||
      mimeType.includes('typescript') ||
      mimeType === 'text/x-python' ||
      mimeType === 'text/x-java-source'
    )
      return FileType.CODE;
    return FileType.OTHER;
  }

  async uploadFiles(
    projectId: string,
    authorId: string,
    files: Express.Multer.File[],
    description?: string,
  ) {
    // Verify project ownership
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException('Project not found');
    if (project.authorId !== authorId) throw new ForbiddenException('Access denied');

    const fileRecords = files.map((file) => ({
      originalName: file.originalname,
      fileName: file.filename,
      filePath: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size,
      fileType: this.detectFileType(file.mimetype),
      description: description || null,
      projectId,
    }));

    const created = await this.prisma.$transaction(
      fileRecords.map((data) => this.prisma.projectFile.create({ data })),
    );

    return created;
  }

  async getFile(fileId: string, authorId: string) {
    const file = await this.prisma.projectFile.findUnique({
      where: { id: fileId },
      include: { project: true },
    });

    if (!file) throw new NotFoundException('File not found');
    if (file.project.authorId !== authorId) throw new ForbiddenException('Access denied');

    return file;
  }

  async deleteFile(fileId: string, authorId: string) {
    const file = await this.prisma.projectFile.findUnique({
      where: { id: fileId },
      include: { project: true },
    });

    if (!file) throw new NotFoundException('File not found');
    if (file.project.authorId !== authorId) throw new ForbiddenException('Access denied');

    // Delete physical file
    const fullPath = path.join(process.cwd(), 'uploads', file.fileName);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Delete DB record
    return this.prisma.projectFile.delete({ where: { id: fileId } });
  }

  async getProjectFiles(projectId: string, authorId: string, fileType?: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException('Project not found');
    if (project.authorId !== authorId) throw new ForbiddenException('Access denied');

    const where: any = { projectId };
    if (fileType) where.fileType = fileType;

    return this.prisma.projectFile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
