import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend | null;
  private readonly fromEmail: string;
  private readonly frontendUrl: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.fromEmail = process.env.FROM_EMAIL ?? 'noreply@millog.co.kr';
    this.frontendUrl = (process.env.FRONTEND_URL ?? 'https://millog.co.kr').split(',')[0];
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;

    if (!this.resend) {
      this.logger.warn(`[MailService] RESEND_API_KEY 미설정. 재설정 링크: ${resetUrl}`);
      return;
    }

    try {
      await this.resend.emails.send({
        from: `Millog <${this.fromEmail}>`,
        to: email,
        subject: '[Millog] 비밀번호 재설정 링크',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #121212; color: #ffffff;">
            <div style="margin-bottom: 32px;">
              <span style="font-size: 22px; font-weight: 800; color: #22FFB2;">Millog</span>
            </div>
            <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 12px;">비밀번호를 재설정해주세요</h1>
            <p style="color: #b3b3b3; font-size: 14px; line-height: 1.6; margin-bottom: 32px;">
              아래 버튼을 클릭하면 새 비밀번호를 설정할 수 있습니다.<br/>
              링크는 <strong style="color: #ffffff;">1시간 후</strong>에 만료됩니다.
            </p>
            <a href="${resetUrl}"
               style="display: inline-block; padding: 14px 32px; background: #22FFB2; color: #001f12; font-weight: 700; font-size: 15px; border-radius: 9999px; text-decoration: none;">
              비밀번호 재설정
            </a>
            <p style="margin-top: 32px; color: #5e5e5e; font-size: 12px; line-height: 1.6;">
              이 이메일을 요청하지 않으셨다면 무시해주세요.<br/>
              링크를 클릭하지 않으면 비밀번호는 변경되지 않습니다.
            </p>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error('이메일 발송 실패', err);
      throw err;
    }
  }
}
