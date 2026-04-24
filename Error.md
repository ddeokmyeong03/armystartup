
15 vulnerabilities (7 moderate, 7 high, 1 critical)
To address all issues, run:
  npm audit fix
Run `npm audit` for details.
> backend@0.0.1 build
> nest build
src/admin/analytics/analytics.service.ts:31:7 - error TS2322: Type '"category"[]' is not assignable to type 'GoalScalarFieldEnum | GoalScalarFieldEnum[]'.
  Type '"category"[]' is not assignable to type 'GoalScalarFieldEnum[]'.
    Type '"category"' is not assignable to type 'GoalScalarFieldEnum'.
31       by: ['category'],
         ~~
  node_modules/.prisma/client/index.d.ts:5047:5
    5047     by: GoalScalarFieldEnum[] | GoalScalarFieldEnum
             ~~
    The expected type comes from property 'by' which is declared here on type '{ where?: GoalWhereInput | undefined; orderBy?: GoalOrderByWithAggregationInput | GoalOrderByWithAggregationInput[] | undefined; ... 8 more ...; _max?: GoalMaxAggregateInputType | undefined; } & { ...; }'
src/admin/analytics/analytics.service.ts:52:66 - error TS2339: Property 'category' does not exist on type 'PickEnumerable<GoalGroupByOutputType, GoalScalarFieldEnum | GoalScalarFieldEnum[]> & { ...; }'.
52         goalsByCategory: goalsByCategory.map(g => ({ category: g.category, count: g._count.id })),
                                                                    ~~~~~~~~
src/admin/analytics/analytics.service.ts:52:83 - error TS18048: 'g._count' is possibly 'undefined'.
52         goalsByCategory: goalsByCategory.map(g => ({ category: g.category, count: g._count.id })),
                                                                                     ~~~~~~~~
src/admin/analytics/analytics.service.ts:52:92 - error TS2339: Property 'id' does not exist on type 'true | { id?: number | undefined; userId?: number | undefined; title?: number | undefined; type?: number | undefined; targetDescription?: number | undefined; preferredMinutesPerSession?: number | undefined; ... 5 more ...; _all?: number | undefined; }'.
  Property 'id' does not exist on type 'true'.
52         goalsByCategory: goalsByCategory.map(g => ({ category: g.category, count: g._count.id })),
                                                                                              ~~
src/admin/analytics/analytics.service.ts:59:7 - error TS2322: Type '"category"[]' is not assignable to type 'GoalScalarFieldEnum | GoalScalarFieldEnum[]'.
  Type '"category"[]' is not assignable to type 'GoalScalarFieldEnum[]'.
    Type '"category"' is not assignable to type 'GoalScalarFieldEnum'.
59       by: ['category'],
         ~~
  node_modules/.prisma/client/index.d.ts:5047:5
    5047     by: GoalScalarFieldEnum[] | GoalScalarFieldEnum
             ~~
    The expected type comes from property 'by' which is declared here on type '{ where?: GoalWhereInput | undefined; orderBy?: GoalOrderByWithAggregationInput | GoalOrderByWithAggregationInput[] | undefined; ... 8 more ...; _max?: GoalMaxAggregateInputType | undefined; } & { ...; }'
src/admin/analytics/analytics.service.ts:73:40 - error TS2353: Object literal may only specify known properties, and 'category' does not exist in type 'GoalSelect<DefaultArgs>'.
73       select: { id: true, title: true, category: true, progressPercent: true, isActive: true, createdAt: true },
                                          ~~~~~~~~
src/admin/analytics/analytics.service.ts:80:23 - error TS2339: Property 'category' does not exist on type 'PickEnumerable<GoalGroupByOutputType, GoalScalarFieldEnum | GoalScalarFieldEnum[]> & { ...; }'.
80           category: g.category,
                         ~~~~~~~~
src/admin/analytics/analytics.service.ts:81:18 - error TS18048: 'g._count' is possibly 'undefined'.
81           count: g._count.id,
                    ~~~~~~~~
Found 17 error(s).
src/admin/analytics/analytics.service.ts:81:27 - error TS2339: Property 'id' does not exist on type 'true | { id?: number | undefined; userId?: number | undefined; title?: number | undefined; type?: number | undefined; targetDescription?: number | undefined; preferredMinutesPerSession?: number | undefined; ... 5 more ...; _all?: number | undefined; }'.
  Property 'id' does not exist on type 'true'.
81           count: g._count.id,
                             ~~
src/admin/analytics/analytics.service.ts:82:35 - error TS18048: 'g._avg' is possibly 'undefined'.
82           avgProgress: Math.round(g._avg.progressPercent ?? 0),
                                     ~~~~~~
src/admin/analytics/analytics.service.ts:136:33 - error TS2353: Object literal may only specify known properties, and 'fatigueType' does not exist in type 'ScheduleSelect<DefaultArgs>'.
136       select: { category: true, fatigueType: true, scheduleDate: true },
                                    ~~~~~~~~~~~
src/admin/analytics/analytics.service.ts:140:22 - error TS2339: Property 'fatigueType' does not exist on type '{ title: string; id: number; createdAt: Date; updatedAt: Date; memo: string | null; userId: number; scheduleDate: string; startTime: string; endTime: string; repeatType: string; category: string; }'.
140       .filter(s => s.fatigueType !== null)
                         ~~~~~~~~~~~
src/admin/analytics/analytics.service.ts:142:34 - error TS2339: Property 'fatigueType' does not exist on type '{ title: string; id: number; createdAt: Date; updatedAt: Date; memo: string | null; userId: number; scheduleDate: string; startTime: string; endTime: string; repeatType: string; category: string; }'.
142         const level = parseInt(s.fatigueType ?? '0');
                                     ~~~~~~~~~~~
src/notifications/notifications.service.ts:10:37 - error TS2339: Property 'notification' does not exist on type 'PrismaService'.
10     const items = await this.prisma.notification.findMany({
                                       ~~~~~~~~~~~~
src/notifications/notifications.service.ts:22:23 - error TS2339: Property 'notification' does not exist on type 'PrismaService'.
22     await this.prisma.notification.updateMany({
                         ~~~~~~~~~~~~
src/notifications/notifications.service.ts:30:23 - error TS2339: Property 'notification' does not exist on type 'PrismaService'.
30     await this.prisma.notification.updateMany({
                         ~~~~~~~~~~~~
src/notifications/notifications.service.ts:38:33 - error TS2339: Property 'notification' does not exist on type 'PrismaService'.
38     const n = await this.prisma.notification.create({
                                   ~~~~~~~~~~~~
==> Build failed 😞
==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys