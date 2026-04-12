import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import apiClient from '@/shared/lib/apiClient';

type Schedule = {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  memo?: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  DUTY: '근무', TRAINING: '훈련', ROLLCALL: '점호',
  PERSONAL: '개인', STUDY: '자기개발', REST: '휴식', OTHER: '기타',
};

const CATEGORY_COLORS: Record<string, string> = {
  DUTY: 'text-[#C05080]',
  TRAINING: 'text-[#B07830]',
  ROLLCALL: 'text-[#6040A0]',
  PERSONAL: 'text-[#4A7BAF]',
  STUDY: 'text-[#3A7D44]',
  REST: 'text-[#8E8E93]',
  OTHER: 'text-[#8E8E93]',
};

export default function TodayPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const today = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    apiClient
      .get<{ data: Schedule[] }>(`/api/schedules?date=${today}`)
      .then((res) => setSchedules(res.data.data ?? []))
      .catch(() => setSchedules([]))
      .finally(() => setLoading(false));
  }, [today]);

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F6]" edges={['top']}>
      <View className="flex-row items-center gap-3 px-5 pt-4 pb-2">
        <Pressable onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
          <Text className="text-[#111111] text-2xl">‹</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-[17px] font-semibold text-[#111111]">오늘 일정</Text>
          <Text className="text-[12px] text-[#8E8E93]">{dayjs().format('M월 D일 dddd')}</Text>
        </View>
        <Pressable
          onPress={() => router.push('/(app)/schedules/new')}
          className="h-8 px-3 bg-[#111111] rounded-full items-center justify-center"
        >
          <Text className="text-white text-[12px] font-semibold">+ 추가</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center py-12">
            <Text className="text-[#8E8E93]">로딩 중...</Text>
          </View>
        ) : schedules.length === 0 ? (
          <View className="items-center py-16 gap-2">
            <Text className="text-[40px]">📅</Text>
            <Text className="text-[15px] font-semibold text-[#111111]">오늘 일정이 없어요</Text>
            <Text className="text-[13px] text-[#8E8E93]">+ 추가 버튼으로 일정을 등록하세요.</Text>
          </View>
        ) : (
          <View className="gap-2 pb-8 pt-2">
            {schedules.map((s) => (
              <View key={s.id} className="bg-white rounded-[16px] px-4 py-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-[15px] font-semibold text-[#111111]">{s.title}</Text>
                    <Text className={`text-[12px] font-medium mt-0.5 ${CATEGORY_COLORS[s.category] ?? 'text-[#8E8E93]'}`}>
                      {CATEGORY_LABELS[s.category] ?? s.category}
                    </Text>
                    {s.memo && <Text className="text-[12px] text-[#8E8E93] mt-0.5">{s.memo}</Text>}
                  </View>
                  <Text className="text-[12px] text-[#8E8E93]">{s.startTime} ~ {s.endTime}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
