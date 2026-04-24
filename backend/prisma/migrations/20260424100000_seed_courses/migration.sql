-- 강의 시드 데이터 (MVP: 직접 큐레이션된 군 장병용 강의 목록)
INSERT INTO courses (title, source, category, "targetGoalType", description, "durationMinutes", url, tags, "matchScore", "isActive", "createdAt", "updatedAt")
VALUES
  -- 자격증
  ('정보처리기사 필기 완전정복', 'JANGBYEONGEEUM', '자격증', 'cert', '정보처리기사 필기 핵심 이론부터 기출문제까지 완성하는 과정', 180, 'https://www.jbeeum.go.kr', '["자격증","IT","정보처리기사"]', 90, true, now(), now()),
  ('컴퓨터활용능력 1급 핵심 정리', 'JANGBYEONGEEUM', '자격증', 'cert', '엑셀·액세스 완벽 정복으로 컴활 1급 합격을 목표로 합니다', 120, 'https://www.jbeeum.go.kr', '["자격증","컴활","오피스"]', 88, true, now(), now()),
  ('한국사능력검정시험 심화', 'JANGBYEONGEEUM', '자격증', 'cert', '한능검 1·2급을 위한 시대별 핵심 개념과 기출 분석', 90, 'https://www.jbeeum.go.kr', '["자격증","한국사","역사"]', 85, true, now(), now()),
  ('운전면허 1종 보통 필기 특강', 'CLASS101', '자격증', 'cert', '군 복무 중 취득 가능한 운전면허 필기 완전 정복', 60, 'https://class101.net', '["자격증","운전면허"]', 82, true, now(), now()),
  ('위험물산업기사 핵심 요약', 'JANGBYEONGEEUM', '자격증', 'cert', '화학 직렬 취업을 위한 위험물산업기사 핵심 이론', 150, 'https://www.jbeeum.go.kr', '["자격증","위험물","화학"]', 80, true, now(), now()),

  -- 어학
  ('TOEIC LC·RC 700+ 속성', 'JANGBYEONGEEUM', '어학', 'lang', '군 복무 중 단기간에 700점을 목표로 하는 실전 대비 과정', 120, 'https://www.jbeeum.go.kr', '["어학","토익","영어"]', 92, true, now(), now()),
  ('TOEIC Speaking 기초-중급', 'CLASS101', '어학', 'lang', '스피킹 기초부터 OPIc IM 수준까지 체계적으로 학습', 90, 'https://class101.net', '["어학","토익스피킹","영어"]', 87, true, now(), now()),
  ('HSK 4급 단어 완성', 'K_MOOC', '어학', 'lang', '취업에 유리한 HSK 4급을 30일 안에 완성하는 집중 코스', 60, 'https://www.kmooc.kr', '["어학","HSK","중국어"]', 83, true, now(), now()),
  ('JLPT N3 기초 문법·단어', 'CLASS101', '어학', 'lang', '일본어 첫걸음부터 N3 합격까지 단계별 커리큘럼', 90, 'https://class101.net', '["어학","JLPT","일본어"]', 81, true, now(), now()),
  ('영어 회화 – 입문 표현 100', 'DEFENSE_TRANSITION', '어학', 'lang', '해외 파병·연합훈련 대비 기초 생활 영어 회화', 45, 'https://www.kdefensa.or.kr', '["어학","영어회화","기초"]', 78, true, now(), now()),

  -- 취업/진로
  ('NCS 직업기초능력 완성', 'DEFENSE_TRANSITION', '취업', 'job', '공기업·공무원 필수 NCS 10개 영역 핵심 이론과 문제풀이', 150, 'https://www.kdefensa.or.kr', '["취업","NCS","공기업"]', 91, true, now(), now()),
  ('자기소개서 & 면접 마스터', 'DEFENSE_TRANSITION', '취업', 'job', '전역 후 취업을 위한 서류·면접 완전 정복 실전 과정', 90, 'https://www.kdefensa.or.kr', '["취업","자소서","면접"]', 89, true, now(), now()),
  ('공무원 행정학개론 핵심 정리', 'JANGBYEONGEEUM', '취업', 'job', '7·9급 공무원 행정학개론 출제 범위 완전 분석', 180, 'https://www.jbeeum.go.kr', '["취업","공무원","행정학"]', 85, true, now(), now()),
  ('경찰 공무원 형사법 특강', 'JANGBYEONGEEUM', '취업', 'job', '형사소송법·형법 핵심 개념으로 경찰 시험 대비', 120, 'https://www.jbeeum.go.kr', '["취업","경찰","형사법"]', 82, true, now(), now()),
  ('이력서 작성 & 링크드인 최적화', 'CLASS101', '취업', 'job', 'AI 시대 취업 전략과 실전 포트폴리오 만들기', 60, 'https://class101.net', '["취업","이력서","포트폴리오"]', 80, true, now(), now()),

  -- 개발/IT
  ('파이썬 입문 – 비전공자도 OK', 'K_MOOC', 'IT', 'it', '데이터 분석과 자동화를 위한 파이썬 첫걸음', 90, 'https://www.kmooc.kr', '["IT","파이썬","프로그래밍"]', 90, true, now(), now()),
  ('웹개발 입문 (HTML·CSS·JS)', 'K_MOOC', 'IT', 'it', '코딩 처음 배우는 분을 위한 웹 개발 전 과정', 180, 'https://www.kmooc.kr', '["IT","웹개발","HTML"]', 87, true, now(), now()),
  ('SQL 데이터 분석 기초', 'K_MOOC', 'IT', 'it', '엑셀 없이 SQL로 데이터를 분석하는 실무 과정', 60, 'https://www.kmooc.kr', '["IT","SQL","데이터분석"]', 85, true, now(), now()),
  ('앱 개발 입문 (React Native)', 'CLASS101', 'IT', 'it', '스마트폰 앱을 직접 만드는 React Native 기초', 120, 'https://class101.net', '["IT","앱개발","리액트네이티브"]', 83, true, now(), now()),
  ('정보보안 기사 핵심 이론', 'JANGBYEONGEEUM', 'IT', 'it', '네트워크·암호학·보안 핵심 이론으로 정보보안 자격증 대비', 150, 'https://www.jbeeum.go.kr', '["IT","보안","정보보안기사"]', 80, true, now(), now()),

  -- 독서/인문
  ('철학 입문: 삶의 질문들', 'K_MOOC', '독서', 'read', '인문학 교양으로 시작하는 동서양 철학 핵심 개념', 60, 'https://www.kmooc.kr', '["독서","철학","인문학"]', 85, true, now(), now()),
  ('경제학 원론 – 기초부터', 'K_MOOC', '독서', 'read', '미시·거시경제 핵심 이론을 일상 예시로 쉽게 이해', 90, 'https://www.kmooc.kr', '["독서","경제학","금융"]', 82, true, now(), now()),
  ('속독법 & 독서 습관 만들기', 'CLASS101', '독서', 'read', '하루 30분 독서로 연 100권을 읽는 독서법 완성', 45, 'https://class101.net', '["독서","속독","습관"]', 80, true, now(), now()),

  -- 체력/건강
  ('맨몸 운동 전신 루틴 – 입문', 'CLASS101', '체력', 'health', '도구 없이 체력을 키우는 홈트 전신 루틴 28일 과정', 30, 'https://class101.net', '["체력","홈트","맨몸운동"]', 90, true, now(), now()),
  ('코어 강화 & 허리 통증 예방', 'CLASS101', '체력', 'health', '장시간 근무로 약해진 코어를 강화하는 재활 운동 프로그램', 30, 'https://class101.net', '["체력","코어","재활"]', 88, true, now(), now()),
  ('체력단련 – PAPS 고득점 전략', 'JANGBYEONGEEUM', '체력', 'health', '국가체력인증 PAPS 전 종목 고득점을 위한 훈련 계획', 45, 'https://www.jbeeum.go.kr', '["체력","PAPS","군인"]', 85, true, now(), now()),

  -- 금융/재테크
  ('주식 투자 입문 – 기초 개념', 'CLASS101', '금융', 'finance', '주식·ETF 기초부터 포트폴리오 구성까지 단기 완성', 60, 'https://class101.net', '["금융","주식","투자"]', 88, true, now(), now()),
  ('전역 후 재무 설계 A to Z', 'DEFENSE_TRANSITION', '금융', 'finance', '전역 후 사회 적응 및 첫 월급 재무 계획 수립 방법', 60, 'https://www.kdefensa.or.kr', '["금융","재무설계","전역"]', 85, true, now(), now()),
  ('부동산 입문: 청약·전세 기초', 'CLASS101', '금융', 'finance', '사회초년생을 위한 청약통장·전세 계약 기초 지식', 45, 'https://class101.net', '["금융","부동산","청약"]', 82, true, now(), now()),

  -- 취미
  ('기타 입문 – 코드 10개로 시작', 'CLASS101', '취미', 'hobby', '기타를 처음 잡는 입문자를 위한 핵심 코드 마스터 과정', 45, 'https://class101.net', '["취미","기타","음악"]', 87, true, now(), now()),
  ('수채화 일러스트 기초', 'CLASS101', '취미', 'hobby', '군 복무 중 즐길 수 있는 힐링 수채화 드로잉 입문', 60, 'https://class101.net', '["취미","수채화","드로잉"]', 85, true, now(), now()),
  ('사진 촬영 & 보정 입문', 'CLASS101', '취미', 'hobby', '스마트폰 하나로 감성 사진을 찍고 보정하는 방법', 45, 'https://class101.net', '["취미","사진","촬영"]', 83, true, now(), now())

;
