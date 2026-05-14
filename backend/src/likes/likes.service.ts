import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensurePostExists(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundException('帖子不存在')
    }

    return post
  }

  async likePost(postId: number, userId: number) {
    await this.ensurePostExists(postId)

    const existedLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    if (!existedLike) {
      await this.prisma.like.create({
        data: {
          userId,
          postId,
        },
      })
    }

    const likesCount = await this.prisma.like.count({
      where: { postId },
    })

    return {
      liked: true,
      likesCount,
    }
  }

  async unlikePost(postId: number, userId: number) {
    await this.ensurePostExists(postId)

    await this.prisma.like.deleteMany({
      where: {
        userId,
        postId,
      },
    })

    const likesCount = await this.prisma.like.count({
      where: { postId },
    })

    return {
      liked: false,
      likesCount,
    }
  }

  async getLikeStatus(postId: number, userId: number) {
    await this.ensurePostExists(postId)

    const existedLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    })

    const likesCount = await this.prisma.like.count({
      where: { postId },
    })

    return {
      liked: !!existedLike,
      likesCount,
    }
  }
}