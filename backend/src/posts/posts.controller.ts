import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostsService } from './posts.service'

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建帖子' })
  create(@Req() req: any, @Body() dto: CreatePostDto) {
    return this.postsService.create(req.user.sub, dto)
  }

  @Get()
  @ApiOperation({ summary: '获取帖子列表' })
  findAll() {
    return this.postsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: '获取帖子详情' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新自己的帖子' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(id, req.user.sub, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除自己的帖子' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.postsService.remove(id, req.user.sub)
  }
}