import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'
import { QueryPostsDto } from './dto/query-posts.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  create(authorId: number, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        authorId,
        title: dto.title,
        content: dto.content,
        coverImage: dto.coverImage,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })
  }

  async findAll(query: QueryPostsDto) {
    const page = Math.max(1, Number(query.page) || 1)
    const pageSize = Math.min(50, Math.max(1, Number(query.pageSize) || 6))
    const skip = (page - 1) * pageSize
    const keyword = query.keyword?.trim()

    const where = keyword
      ? {
          OR: [
            {
              title: {
                contains: keyword,
              },
            },
            {
              content: {
                contains: keyword,
              },
            },
          ],
        }
      : undefined

    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
              bio: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),

      this.prisma.post.count({
        where,
      }),
    ])

    const totalPages = Math.ceil(total / pageSize)

    return {
      items,
      meta: {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage: page < totalPages,
      },
    }
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })

    if (!post) {
      throw new NotFoundException('帖子不存在')
    }

    return post
  }

  async update(id: number, userId: number, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    })

    if (!post) {
      throw new NotFoundException('帖子不存在')
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('无权修改他人的帖子')
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
        coverImage: dto.coverImage,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })
  }

  async remove(id: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    })

    if (!post) {
      throw new NotFoundException('帖子不存在')
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('无权删除他人的帖子')
    }

    await this.prisma.post.delete({
      where: { id },
    })

    return {
      message: '帖子删除成功',
    }
  }
}