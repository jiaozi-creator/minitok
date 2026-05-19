import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class QueryPostsDto {
  @ApiPropertyOptional({ example: 1, description: '当前页码' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @ApiPropertyOptional({ example: 6, description: '每页数量' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize?: number

  @ApiPropertyOptional({ example: '摄影', description: '搜索关键词，Day12 会接入搜索框' })
  @IsOptional()
  @IsString()
  keyword?: string
}