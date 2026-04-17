import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export type UserInRequest = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthenticatedRequest = Request & {
  user?: UserInRequest;
};

type UserDecoratorOutput =
  | UserInRequest
  | UserInRequest[keyof UserInRequest]
  | null;

export const User = createParamDecorator<
  keyof UserInRequest | undefined,
  UserDecoratorOutput
>((data: keyof UserInRequest | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  const user = request.user;

  if (!user) {
    return null;
  }

  if (!data) {
    return user;
  }

  return user[data] ?? null;
});
