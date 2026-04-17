import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/common/utils/api-response';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async me(userId: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return ApiResponse.success(user, 'User profile retrieved successfully');
  }
}
