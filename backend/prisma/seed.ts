import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.course.createMany({
    data: [
      // 장병e음 강의
      {
        title: '장병e음 토익 집중과정',
        source: 'JANGBYEONGEEUM',
        category: 'LANGUAGE',
        targetGoalType: 'STUDY',
        description: '군 복무 중 토익 점수 향상을 위한 집중 강의. RC/LC 전 영역 커버.',
        durationMinutes: 60,
        url: 'https://www.jbemc.mil.kr',
        tags: ['토익', '영어', '청취', 'RC', 'LC'],
      },
      {
        title: '장병e음 컴퓨터활용능력 2급',
        source: 'JANGBYEONGEEUM',
        category: 'IT',
        targetGoalType: 'CERTIFICATE',
        description: '컴활 2급 자격증 취득을 위한 기초~실전 강의.',
        durationMinutes: 90,
        url: 'https://www.jbemc.mil.kr',
        tags: ['컴활', '자격증', '엑셀', '스프레드시트'],
      },
      {
        title: '장병e음 한국사능력검정시험',
        source: 'JANGBYEONGEEUM',
        category: 'CERTIFICATE',
        targetGoalType: 'CERTIFICATE',
        description: '한국사 1~2급 대비 강의. 군 가산점 취득 가능.',
        durationMinutes: 45,
        url: 'https://www.jbemc.mil.kr',
        tags: ['한국사', '자격증', '가산점'],
      },
      {
        title: '장병e음 독서 논술 특강',
        source: 'JANGBYEONGEEUM',
        category: 'LANGUAGE',
        targetGoalType: 'READING',
        description: '독해력 향상과 논술 작성 능력을 키우는 강의.',
        durationMinutes: 30,
        url: 'https://www.jbemc.mil.kr',
        tags: ['독서', '논술', '독해'],
      },
      {
        title: '장병e음 체력단련 프로그램',
        source: 'JANGBYEONGEEUM',
        category: 'EXERCISE',
        targetGoalType: 'EXERCISE',
        description: '체계적인 군 체력 향상 프로그램. 코어, 유산소 포함.',
        durationMinutes: 40,
        url: 'https://www.jbemc.mil.kr',
        tags: ['운동', '체력', '헬스', '코어'],
      },
      // 국방전직교육원 공고
      {
        title: '국방전직교육원 취업 특강 — 자기소개서·면접',
        source: 'DEFENSE_TRANSITION',
        category: 'LEADERSHIP',
        targetGoalType: null,
        description: '전역 후 민간 취업을 준비하는 병사를 위한 자기소개서 작성 및 면접 특강.',
        durationMinutes: 120,
        url: 'https://www.kdemtc.or.kr',
        tags: ['취업', '자기소개서', '면접', '전직'],
      },
      {
        title: '국방전직교육원 창업 교육 과정',
        source: 'DEFENSE_TRANSITION',
        category: 'LEADERSHIP',
        targetGoalType: null,
        description: '군 전역 후 창업을 희망하는 병사를 위한 창업 기초 교육.',
        durationMinutes: 180,
        url: 'https://www.kdemtc.or.kr',
        tags: ['창업', '스타트업', '비즈니스'],
      },
      {
        title: '국방전직교육원 IT 직무교육',
        source: 'DEFENSE_TRANSITION',
        category: 'IT',
        targetGoalType: 'CODING',
        description: '전역 후 IT 분야 취업을 위한 프로그래밍 기초 직무교육.',
        durationMinutes: 120,
        url: 'https://www.kdemtc.or.kr',
        tags: ['IT', '프로그래밍', '코딩', '취업'],
      },
      // K-MOOC 강의
      {
        title: 'K-MOOC 파이썬 프로그래밍 기초',
        source: 'K_MOOC',
        category: 'IT',
        targetGoalType: 'CODING',
        description: '대학 수준 파이썬 입문 강의. 서울대·연세대 교수진 참여.',
        durationMinutes: 60,
        url: 'https://www.kmooc.kr',
        tags: ['파이썬', '코딩', '프로그래밍', 'AI'],
      },
      {
        title: 'K-MOOC AI 기초와 윤리',
        source: 'K_MOOC',
        category: 'IT',
        targetGoalType: 'STUDY',
        description: '인공지능의 기초 개념과 사회적 영향, AI 윤리를 다루는 강의.',
        durationMinutes: 45,
        url: 'https://www.kmooc.kr',
        tags: ['AI', '인공지능', '윤리', '기초'],
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ 강의 시드 데이터 입력 완료 (총 10건)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
