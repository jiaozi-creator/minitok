import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { LikesService } from './likes.service'

@ApiTags('likes')
@Controller('posts/:id')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '点赞帖子' })
  likePost(@Param('id', ParseIntPipe) postId: number, @Req() req: any) {
    return this.likesService.likePost(postId, req.user.sub)
  }

  @Delete('like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取消点赞帖子' })
  unlikePost(@Param('id', ParseIntPipe) postId: number, @Req() req: any) {
    return this.likesService.unlikePost(postId, req.user.sub)
  }

  @Get('like-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户对帖子的点赞状态' })
  getLikeStatus(@Param('id', ParseIntPipe) postId: number, @Req() req: any) {
    return this.likesService.getLikeStatus(postId, req.user.sub)
  }
}