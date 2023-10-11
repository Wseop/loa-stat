import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

const DYNAMIC_AUTH_GUARD = ['google'].reduce((prev, curr) => {
  return {
    ...prev,
    [curr]: new (class extends AuthGuard(curr) {})(),
  };
}, {});

// const DYNAMIC_AUTH_GUARD = {
//   google: new (class extends AuthGuard('google') {})(),
// };

// parameter를 받을 수 있는 AuthGuard
export class DynamicAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { social } = context.switchToHttp().getRequest().params;
    return DYNAMIC_AUTH_GUARD[social].canActivate(context);
  }
}
