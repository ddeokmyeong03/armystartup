import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID ?? '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? '',
      callbackURL: `${process.env.BACKEND_URL ?? ''}/api/auth/kakao/callback`,
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: (err: any, user?: any) => void,
  ) {
    const { id, _json } = profile;
    const kakaoAccount = _json?.kakao_account ?? {};
    done(null, {
      provider: 'KAKAO',
      socialId: String(id),
      email: kakaoAccount.email ?? `kakao_${id}@millog.kr`,
      nickname: kakaoAccount.profile?.nickname ?? '카카오사용자',
    });
  }
}
