import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // AdminUser 기본 계정 생성
  const bcrypt = await import('bcryptjs');
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? 'admin1234', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@millog.kr' },
    update: {},
    create: { email: 'admin@millog.kr', passwordHash: hash, role: 'ADMIN' },
  });
  console.log('✅ 어드민 계정 준비 완료');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
