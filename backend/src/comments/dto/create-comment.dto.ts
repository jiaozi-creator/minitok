import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class CreateCommentDto {
  @ApiProperty({ example: '这篇帖子写得很好！' })
  @IsString()
  @Length(1, 500)
  content: string
}