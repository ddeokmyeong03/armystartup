import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import AppleStrategy from 'passport-apple';

@Injectable()
export class AppleAuthStrategy extends PassportStrategy(AppleStrategy, 'apple') {
  constructor() {
    super({
      clientID: process.env.APPLE_CLIENT_ID ?? '',
      teamID: process.env.APPLE_TEAM_ID ?? '',
      keyID: process.env.APPLE_KEY_ID ?? '',
      privateKeyString: (process.env.APPLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
      callbackURL: `${process.env.BACKEND_URL ?? ''}/api/auth/apple/callback`,
      scope: ['name', 'email'],
      passReqToCallback: false,
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    idToken: any,
    profile: any,
    done: (err: any, user?: any) => void,
  ) {
    const sub = idToken?.sub ?? profile?.id ?? '';
    const email = idToken?.email ?? profile?.email ?? `apple_${sub}@millog.kr`;
    const name = profile?.name
      ? `${profile.name.firstName ?? ''} ${profile.name.lastName ?? ''}`.trim()
      : 'Apple사용자';
    done(null, {
      provider: 'APPLE',
      socialId: sub,
      email,
      nickname: name || 'Apple사용자',
    });
  }
}
