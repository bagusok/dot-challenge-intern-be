import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/common/utils/api-response';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUserMessageDto } from './dto/get-user-message.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserMessage(userId: string, q: GetUserMessageDto) {
    const messages = await this.prismaService.messages.findMany({
      where: { receiverId: userId },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      orderBy: {
        createdAt: q.sortBy,
      },
      omit: {
        isReported: true,
      },
    });

    const count = await this.prismaService.messages.count({
      where: { receiverId: userId },
    });

    return ApiResponse.paginated(messages, count, q.page, q.limit);
  }

  async deleteMessage(userId: string, messageId: string) {
    const message = await this.prismaService.messages.findUnique({
      where: { id: messageId },
    });

    if (!message || message.receiverId !== userId) {
      return ApiResponse.error('Message not found or unauthorized');
    }

    await this.prismaService.messages.delete({
      where: { id: messageId },
    });

    return ApiResponse.success(null, 'Message deleted successfully');
  }

  async getMessageDetail(userId: string, messageId: string) {
    const message = await this.prismaService.messages.findUnique({
      where: { id: messageId },
      omit: {
        isReported: true,
      },
    });

    if (!message || message.receiverId !== userId) {
      return ApiResponse.error('Message not found or unauthorized');
    }

    return ApiResponse.success(message);
  }

  async sendMessage(receiverUsername: string, data: SendMessageDto) {
    const receiver = await this.prismaService.users.findUnique({
      where: { username: receiverUsername },
    });

    if (!receiver) {
      return ApiResponse.error('Receiver not found');
    }

    await this.prismaService.messages.create({
      data: {
        receiverId: receiver.id,
        content: data.content,
      },
    });
    return ApiResponse.success(null, 'Message sent successfully');
  }
}
