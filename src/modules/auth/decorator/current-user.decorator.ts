import { createParamDecorator } from '@nestjs/common';
import { CurrentUserDto } from '../dto/current-user.dto';

export const CurrentUser = createParamDecorator((_, ctx): CurrentUserDto => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
