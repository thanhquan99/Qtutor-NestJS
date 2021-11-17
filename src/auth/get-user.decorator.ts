import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/db/models';
import { ModelFields } from 'src/db/models/BaseModel';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): ModelFields<User> => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
