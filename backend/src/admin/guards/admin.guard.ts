import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers.authorization ?? '';

    if (!auth.startsWith('Basic ')) throw new UnauthorizedException('관리자 인증이 필요합니다.');

    const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
    const [email, password] = decoded.split(':');

    const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@millog.kr';
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'millog-admin-2026';

    if (email !== adminEmail || password !== adminPassword) {
      throw new UnauthorizedException('관리자 인증 정보가 올바르지 않습니다.');
    }

    return true;
  }
}
