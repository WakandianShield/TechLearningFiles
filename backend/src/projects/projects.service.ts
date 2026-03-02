import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36);
  }

  async create(authorId: string, dto: CreateProjectDto) {
    const slug = this.generateSlug(dto.title);
    return this.prisma.project.create({
      data: {
        ...dto,
        slug,
        authorId,
      },
      include: { files: true, author: { select: { id: true, name: true, email: true } } },
    });
  }

  async findAll(authorId: string, category?: string) {
    const where: any = { authorId };
    if (category) where.category = category;

    return this.prisma.project.findMany({
      where,
      include: {
        files: true,
        _count: { select: { files: true } },
      },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string, authorId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        files: { orderBy: { createdAt: 'desc' } },
        author: { select: { id: true, name: true, email: true } },
      },
    });

    if (!project) throw new NotFoundException('Project not found');
    if (project.authorId !== authorId) throw new ForbiddenException('Access denied');

    return project;
  }

  async findBySlug(slug: string, authorId: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        files: { orderBy: { createdAt: 'desc' } },
        author: { select: { id: true, name: true, email: true } },
      },
    });

    if (!project) throw new NotFoundException('Project not found');
    if (project.authorId !== authorId) throw new ForbiddenException('Access denied');

    return project;
  }

  async update(id: string, authorId: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.authorId !== authorId) throw new ForbiddenException('Access denied');

    return this.prisma.project.update({
      where: { id },
      data: dto,
      include: { files: true },
    });
  }

  async remove(id: string, authorId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.authorId !== authorId) throw new ForbiddenException('Access denied');

    return this.prisma.project.delete({ where: { id } });
  }

  async togglePin(id: string, authorId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.authorId !== authorId) throw new ForbiddenException('Access denied');

    return this.prisma.project.update({
      where: { id },
      data: { pinned: !project.pinned },
    });
  }

  async getStats(authorId: string) {
    const [projectCount, fileCount, categories] = await Promise.all([
      this.prisma.project.count({ where: { authorId } }),
      this.prisma.projectFile.count({
        where: { project: { authorId } },
      }),
      this.prisma.project.groupBy({
        by: ['category'],
        where: { authorId },
        _count: true,
      }),
    ]);

    return { projectCount, fileCount, categories };
  }

  async explore(category?: string, search?: string) {
    const where: any = { visibility: 'PUBLIC' };
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.project.findMany({
      where,
      include: {
        _count: { select: { files: true } },
        author: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: [{ createdAt: 'desc' }],
      take: 50,
    });
  }

  async findOnePublic(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        files: { orderBy: { createdAt: 'desc' } },
        author: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    if (!project) throw new NotFoundException('Project not found');
    if (project.visibility !== 'PUBLIC') throw new NotFoundException('Project not found');

    return project;
  }
}
