import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * 공공데이터포털 K-MOOC 강좌정보 API 응답 타입
 * https://www.data.go.kr/data/15042355/openapi.do
 */
interface KmoocItem {
  crsId: string;            // 강좌 ID
  crsNm: string;            // 강좌명
  crsSmry: string;          // 강좌 요약/설명
  orgNm: string;            // 제공 기관명
  crsRuntime: string;       // 총 강의 시간 (분 or 시간)
  keyword: string;          // 키워드 (쉼표 구분)
  classUrl: string;         // 강좌 URL
  crsOpenDt: string;        // 개강일 (YYYY-MM-DD)
  crsClsDt: string;         // 종강일
  crsLang: string;          // 언어
  crsRgstTrgtNm: string;    // 수강 대상
  middleCategoryNm: string; // 중분류 카테고리명
  largeCategoryNm: string;  // 대분류 카테고리명
}

interface KmoocApiResponse {
  response: {
    header: { resultCode: string; resultMsg: string };
    body: {
      items: { item: KmoocItem | KmoocItem[] } | KmoocItem[];
      totalCount: number;
      numOfRows: number;
      pageNo: number;
    };
  };
}

@Injectable()
export class KmoocSyncService {
  private readonly logger = new Logger(KmoocSyncService.name);
  private readonly API_BASE =
    'https://api.data.go.kr/openapi/tn_pubr_public_kmooc_crs_info/rest/kmoocCrsInfoSearch';

  constructor(private readonly prisma: PrismaService) {}

  /**
   * K-MOOC 강좌 전체 동기화 (최대 100건)
   * Render 배포 후 POST /api/courses/admin/sync-kmooc 로 호출
   */
  async syncCourses(): Promise<{ synced: number; skipped: number; errors: string[] }> {
    const serviceKey = process.env.KMOOC_API_KEY ?? '';
    if (!serviceKey) throw new Error('KMOOC_API_KEY 환경 변수가 설정되지 않았습니다.');

    const result = { synced: 0, skipped: 0, errors: [] as string[] };

    try {
      const items = await this.fetchItems(serviceKey, 100);
      this.logger.log(`K-MOOC API에서 ${items.length}건 수신`);

      for (const item of items) {
        try {
          await this.upsertCourse(item);
          result.synced++;
        } catch (err) {
          result.errors.push(`${item.crsId}: ${(err as Error).message}`);
          result.skipped++;
        }
      }
    } catch (err) {
      const msg = (err as Error).message;
      this.logger.error(`K-MOOC API 호출 실패: ${msg}`);
      throw new Error(`K-MOOC API 호출 실패: ${msg}`);
    }

    this.logger.log(`동기화 완료 — 성공: ${result.synced}, 실패: ${result.skipped}`);
    return result;
  }

  private async fetchItems(serviceKey: string, numOfRows: number): Promise<KmoocItem[]> {
    const url = new URL(this.API_BASE);
    url.searchParams.set('ServiceKey', serviceKey);
    url.searchParams.set('pageNo', '1');
    url.searchParams.set('numOfRows', String(numOfRows));
    url.searchParams.set('dataType', 'JSON');

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = (await res.json()) as KmoocApiResponse;
    const body = data?.response?.body;
    if (!body) throw new Error('API 응답 형식이 올바르지 않습니다.');

    const { items } = body;
    if (!items) return [];

    // 공공데이터포털 API: 다건은 배열, 1건은 객체로 반환
    if (Array.isArray(items)) return items;
    if ('item' in items) {
      const item = items.item;
      return Array.isArray(item) ? item : [item];
    }
    return [];
  }

  private async upsertCourse(item: KmoocItem): Promise<void> {
    const title = (item.crsNm ?? '').trim();
    if (!title) return;

    const tags = this.parseTags(item.keyword, item.largeCategoryNm, item.middleCategoryNm);
    const durationMinutes = this.parseDuration(item.crsRuntime);
    const category = this.inferCategory(item.largeCategoryNm, item.middleCategoryNm, tags);
    const targetGoalType = this.inferGoalType(category, tags);
    const url = item.classUrl || 'https://www.kmooc.kr';
    const description = (item.crsSmry ?? '').slice(0, 500) || `${item.orgNm ?? 'K-MOOC'} 제공 강좌`;

    await this.prisma.course.upsert({
      where: { externalId: item.crsId },
      create: {
        externalId: item.crsId,
        title,
        source: 'K_MOOC',
        category,
        targetGoalType,
        description,
        durationMinutes,
        url,
        tags: JSON.stringify(tags),
        isActive: true,
      },
      update: { title, description, durationMinutes, url, tags: JSON.stringify(tags), isActive: true },
    });
  }

  // ─── 파싱 헬퍼 ──────────────────────────────────────────────────────────────

  private parseTags(keyword: string, large: string, middle: string): string[] {
    const raw: string[] = [];
    if (keyword) raw.push(...keyword.split(/[,，\s]+/).map((t) => t.trim()).filter(Boolean));
    if (large) raw.push(large.trim());
    if (middle && middle !== large) raw.push(middle.trim());
    return [...new Set(raw)].slice(0, 8);
  }

  private parseDuration(runtime: string): number {
    if (!runtime) return 60;
    const num = parseFloat(runtime.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return 60;
    if (runtime.includes('분')) return Math.round(num);
    if (runtime.includes('시간')) return Math.round(num * 60);
    return num <= 20 ? Math.round(num * 60) : Math.round(num);
  }

  private inferCategory(large: string, middle: string, tags: string[]): string {
    const text = `${large} ${middle} ${tags.join(' ')}`.toLowerCase();
    if (/영어|토익|토플|어학|언어/.test(text)) return 'LANGUAGE';
    if (/it|프로그래밍|코딩|소프트웨어|컴퓨터|파이썬|자바|데이터/.test(text)) return 'IT';
    if (/자격증|certificate/.test(text)) return 'CERTIFICATE';
    if (/리더십|leadership|커뮤니케이션|소통/.test(text)) return 'LEADERSHIP';
    if (/운동|체력|헬스|exercise/.test(text)) return 'EXERCISE';
    return 'OTHER';
  }

  private inferGoalType(category: string, tags: string[]): string {
    const text = `${category} ${tags.join(' ')}`.toLowerCase();
    if (/certificate/.test(text)) return 'CERTIFICATE';
    if (/it/.test(text)) return 'CODING';
    if (/language/.test(text)) return 'STUDY';
    if (/exercise/.test(text)) return 'EXERCISE';
    if (/reading|독서|인문|문학/.test(text)) return 'READING';
    return 'STUDY';
  }
}
