import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { User, UserInRequest } from 'src/common/decorators/user.decorator';
import { GetUserMessageDto } from './dto/get-user-message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserMessages(
    @User() user: UserInRequest,
    @Query() q: GetUserMessageDto,
  ) {
    return this.messagesService.getUserMessage(user.id, q);
  }

  @Post(':receiverUsername')
  async sendMessage(
    @Param('receiverUsername') receiverUsername: string,
    @Body() data: SendMessageDto,
  ) {
    return this.messagesService.sendMessage(receiverUsername, data);
  }

  @UseGuards(AuthGuard)
  @Get(':messageId')
  async getMessageDetail(
    @User() user: UserInRequest,
    @Param('messageId', ParseUUIDPipe) messageId: string,
  ) {
    return this.messagesService.getMessageDetail(user.id, messageId);
  }

  @UseGuards(AuthGuard)
  @Delete(':messageId')
  async deleteMessage(
    @User() user: UserInRequest,
    @Param('messageId', ParseUUIDPipe) messageId: string,
  ) {
    return this.messagesService.deleteMessage(user.id, messageId);
  }
}
