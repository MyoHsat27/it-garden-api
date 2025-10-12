import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class UserIdInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (user && user.id) {
      req.body.userId = user.id;
    }

    return next.handle().pipe(
      map((data: any) => {
        if (user) {
          return { ...data, userId: user.id };
        } else {
          return data;
        }
      }),
    );
  }
}
