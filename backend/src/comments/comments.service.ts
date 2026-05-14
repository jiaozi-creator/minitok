import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCommentDto } from './dto/create-comment.dto'

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postId: number, userId: number, dto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundException('帖子不存在')
    }

    return this.prisma.comment.create({
      data: {
        postId,
        userId,
        content: dto.content,
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
    })
  }

  async findByPostId(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundException('帖子不存在')
    }

    return this.prisma.comment.findMany({
      where: { postId },
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
    })
  }

  async remove(commentId: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      throw new NotFoundException('评论不存在')
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('无权删除他人的评论')
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    })

    return {
      message: '评论删除成功',
    }
  }
}