import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID ?? '',
      clientSecret: process.env.NAVER_CLIENT_SECRET ?? '',
      callbackURL: `${process.env.BACKEND_URL ?? ''}/api/auth/naver/callback`,
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: (err: any, user?: any) => void,
  ) {
    const { id, email, nickname, name } = profile;
    done(null, {
      provider: 'NAVER',
      socialId: String(id),
      email: email ?? `naver_${id}@millog.kr`,
      nickname: nickname ?? name ?? '네이버사용자',
    });
  }
}
