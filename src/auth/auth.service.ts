import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/common/types/jwt.type';
import { ApiResponse } from 'src/common/utils/api-response';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(data: RegisterDto) {
    const user = await this.prismaService.users.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (user) {
      throw new BadRequestException('Email or username already exists');
    }

    const hashPassword = bcrypt.hashSync(data.password, 10);

    await this.prismaService.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashPassword,
        username: data.username,
      },
    });

    return ApiResponse.success(null, 'User registered successfully');
  }

  async login(data: LoginDto) {
    const user = await this.prismaService.users.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = bcrypt.compareSync(data.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload: JwtPayload = { sub: user.id, id: user.id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: '12h',
    });

    return ApiResponse.success({ token }, 'Login successful');
  }
}
