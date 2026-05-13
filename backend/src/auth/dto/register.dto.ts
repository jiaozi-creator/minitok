import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length, MinLength } from 'class-validator'

export class RegisterDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'olivia' })
  @IsString()
  @Length(3, 20)
  username: string

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string
}