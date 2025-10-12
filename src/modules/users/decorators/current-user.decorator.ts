import { createParamDecorator, Logger } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";
import { User } from "../entities";

export const CurrentUser = createParamDecorator<
  keyof User | undefined,
  ExecutionContext
>((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  if (!user) {
    return null;
  }
  return data ? user[data] : user;
});
