import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import apiClient from '@/shared/lib/apiClient';
import { getNickname } from '@/shared/lib/auth';

type Schedule = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
};

type Goal = {
  id: number;
  title: string;
  progressPercent: number;
  type: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  DUTY: 'bg-[#FDE8F0]',
  TRAINING: 'bg-[#FFF3DC]',
  ROLLCALL: 'bg-[#EDE8F8]',
  PERSONAL: 'bg-[#DCE8F8]',
  STUDY: 'bg-[#E8F4E8]',
  REST: 'bg-[#EFEFEF]',
  OTHER: 'bg-[#F8F8F6]',
};

const CATEGORY_DOT: Record<string, string> = {
  DUTY: 'bg-[#C05080]',
  TRAINING: 'bg-[#B07830]',
  ROLLCALL: 'bg-[#6040A0]',
  PERSONAL: 'bg-[#4A7BAF]',
  STUDY: 'bg-[#3A7D44]',
  REST: 'bg-[#8E8E93]',
  OTHER: 'bg-[#8E8E93]',
};

export default function HomePage() {
  const [nickname, setNickname] = useState('사용자');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const today = dayjs().format('YYYY년 M월 D일 dddd');

  useEffect(() => {
    getNickname().then(setNickname);

    const dateStr = dayjs().format('YYYY-MM-DD');
    apiClient
      .get<{ data: Schedule[] }>(`/api/schedules?date=${dateStr}`)
      .then((res) => setSchedules(res.data.data ?? []))
      .catch(() => {});

    apiClient
      .get<{ data: Goal[] }>('/api/goals')
      .then((res) => setGoals((res.data.data ?? []).filter((g: any) => g.isActive).slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F6]" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
          <View>
            <Text className="text-[22px] font-bold text-[#111111]">{nickname} 님</Text>
            <Text className="text-[13px] text-[#8E8E93] mt-0.5">{today}</Text>
          </View>
          <Pressable
            onPress={() => router.push('/(app)/notifications')}
            className="w-10 h-10 items-center justify-center bg-white rounded-full"
          >
            <Text className="text-lg">🔔</Text>
          </Pressable>
        </View>

        <View className="px-5 pb-8 gap-4">
          {/* 오늘 일정 */}
          <View className="bg-white rounded-[20px] px-5 py-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[15px] font-bold text-[#111111]">오늘 일정</Text>
              <Pressable onPress={() => router.push('/(app)/today')}>
                <Text className="text-[12px] text-[#4A7BAF] font-medium">전체보기</Text>
              </Pressable>
            </View>

            {schedules.length === 0 ? (
              <View className="py-4 items-center">
                <Text className="text-[13px] text-[#C7C7CC]">오늘 일정이 없습니다</Text>
              </View>
            ) : (
              <View className="gap-2">
                {schedules.slice(0, 4).map((s) => (
                  <View key={s.id} className={`flex-row items-center gap-3 rounded-[12px] px-3 py-2.5 ${CATEGORY_COLORS[s.category] ?? 'bg-[#F8F8F6]'}`}>
                    <View className={`w-2 h-2 rounded-full ${CATEGORY_DOT[s.category] ?? 'bg-[#8E8E93]'}`} />
                    <Text className="text-[13px] font-semibold text-[#111111] flex-1">{s.title}</Text>
                    <Text className="text-[11px] text-[#8E8E93]">{s.startTime} ~ {s.endTime}</Text>
                  </View>
                ))}
              </View>
            )}

            <Pressable
              onPress={() => router.push('/(app)/schedules/new')}
              className="mt-3 h-[40px] border border-[#EFEFEF] rounded-[12px] items-center justify-center"
            >
              <Text className="text-[13px] font-medium text-[#8E8E93]">+ 일정 추가</Text>
            </Pressable>
          </View>

          {/* 진행 중인 목표 */}
          {goals.length > 0 && (
            <View className="bg-white rounded-[20px] px-5 py-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-[15px] font-bold text-[#111111]">진행 중인 목표</Text>
                <Pressable onPress={() => router.push('/(app)/goals/index')}>
                  <Text className="text-[12px] text-[#4A7BAF] font-medium">전체보기</Text>
                </Pressable>
              </View>
              <View className="gap-3">
                {goals.map((g) => (
                  <View key={g.id}>
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-[13px] font-semibold text-[#111111] flex-1 mr-2" numberOfLines={1}>{g.title}</Text>
                      <Text className="text-[12px] font-bold text-[#111111]">{g.progressPercent}%</Text>
                    </View>
                    <View className="h-2 bg-[#F0F0EE] rounded-full overflow-hidden">
                      <View
                        className="h-full bg-[#111111] rounded-full"
                        style={{ width: `${g.progressPercent}%` }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 빠른 메뉴 */}
          <View className="grid grid-cols-2 flex-row gap-3">
            <Pressable
              onPress={() => router.push('/(app)/roadmap')}
              className="flex-1 bg-[#111111] rounded-[16px] px-4 py-4"
            >
              <Text className="text-2xl mb-1">🗺️</Text>
              <Text className="text-[14px] font-bold text-white">학습 로드맵</Text>
              <Text className="text-[11px] text-[#8E8E93] mt-0.5">AI 맞춤 로드맵</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/(app)/recommend')}
              className="flex-1 bg-white rounded-[16px] px-4 py-4"
            >
              <Text className="text-2xl mb-1">📚</Text>
              <Text className="text-[14px] font-bold text-[#111111]">강의 추천</Text>
              <Text className="text-[11px] text-[#8E8E93] mt-0.5">AI 추천 강의</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
