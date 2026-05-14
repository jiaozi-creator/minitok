import {
  Body,
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
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'

@ApiTags('comments')
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '给帖子发表评论' })
  create(
    @Param('id', ParseIntPipe) postId: number,
    @Req() req: any,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(postId, req.user.sub, dto)
  }

  @Get('posts/:id/comments')
  @ApiOperation({ summary: '获取指定帖子的评论列表' })
  findByPostId(@Param('id', ParseIntPipe) postId: number) {
    return this.commentsService.findByPostId(postId)
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除自己的评论' })
  remove(@Param('id', ParseIntPipe) commentId: number, @Req() req: any) {
    return this.commentsService.remove(commentId, req.user.sub)
  }
}