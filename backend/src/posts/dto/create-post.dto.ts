import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, Length, MaxLength } from 'class-validator'

export class CreatePostDto {
  @ApiProperty({ example: '我的第一篇帖子' })
  @IsString()
  @Length(1, 120)
  title: string

  @ApiProperty({ example: '这是帖子正文内容。' })
  @IsString()
  @Length(1, 5000)
  content: string

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  coverImage?: string
}
