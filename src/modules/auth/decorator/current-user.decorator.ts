import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserDto } from '../dto/current-user.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserDto => {
    void data;

    const request = ctx.switchToHttp().getRequest<{ user: CurrentUserDto }>();

    return request.user;
  },
);
