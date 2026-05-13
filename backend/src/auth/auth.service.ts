import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private sanitizeUser(user: {
    id: number
    email: string
    username: string
    avatar?: string | null
    bio?: string | null
    createdAt?: Date
    updatedAt?: Date
  }) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar ?? null,
      bio: user.bio ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  async register(dto: RegisterDto) {
    const existedEmailUser = await this.usersService.findByEmail(dto.email)
    if (existedEmailUser) {
      throw new BadRequestException('邮箱已被注册')
    }

    const existedUsernameUser = await this.usersService.findByUsername(
      dto.username,
    )
    if (existedUsernameUser) {
      throw new BadRequestException('用户名已存在')
    }

    const passwordHash = await bcrypt.hash(dto.password, 10)

    const user = await this.usersService.createUser({
      email: dto.email,
      username: dto.username,
      passwordHash,
    })

    return this.sanitizeUser(user)
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email)
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误')
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误')
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    }

    const accessToken = await this.jwtService.signAsync(payload)

    return {
      accessToken,
      user: this.sanitizeUser(user),
    }
  }

  async getCurrentUser(userId: number) {
    const user = await this.usersService.findById(userId)
    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    return this.sanitizeUser(user)
  }
}