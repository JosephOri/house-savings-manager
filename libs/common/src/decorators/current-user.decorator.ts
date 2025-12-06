import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@app/common';

const getCurrentUserByContext = (ctx: ExecutionContext): User => {
  return ctx.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx),
);
