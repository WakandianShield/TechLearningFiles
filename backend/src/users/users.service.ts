import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({ data });
  }

  async createOAuth(data: {
    name: string;
    email: string;
    provider: string;
    providerAccountId: string;
    avatar?: string;
  }) {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: { name?: string; bio?: string; avatar?: string; banner?: string; website?: string; socialLinks?: any }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async getProfile(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        banner: true,
        website: true,
        socialLinks: true,
        createdAt: true,
        _count: { select: { projects: true } },
      },
    });
  }

  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        bio: true,
        avatar: true,
        banner: true,
        website: true,
        socialLinks: true,
        createdAt: true,
        _count: { select: { projects: { where: { visibility: 'PUBLIC' } } } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getPublicProjects(userId: string, category?: string) {
    const where: any = { authorId: userId, visibility: 'PUBLIC' };
    if (category) where.category = category;

    return this.prisma.project.findMany({
      where,
      include: {
        _count: { select: { files: true } },
        author: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async searchUsers(query: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        _count: { select: { projects: { where: { visibility: 'PUBLIC' } } } },
      },
      take: 20,
    });
  }
}
