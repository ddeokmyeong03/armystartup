import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '@/shared/lib/apiClient';

type Goal = {
  id: number;
  title: string;
  type: string;
  targetDescription?: string;
  preferredMinutesPerSession: number;
  preferredSessionsPerWeek: number;
  progressPercent: number;
  isActive: boolean;
  createdAt: string;
};

const TYPE_LABELS: Record<string, string> = {
  STUDY: '공부', CERTIFICATE: '자격증', EXERCISE: '운동',
  READING: '독서', CODING: '코딩', OTHER: '기타',
};
const TYPE_ICONS: Record<string, string> = {
  STUDY: '📖', CERTIFICATE: '🏆', EXERCISE: '💪',
  READING: '📚', CODING: '💻', OTHER: '⭐',
};

export default function GoalDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiClient
      .get<{ data: Goal }>(`/api/goals/${id}`)
      .then((res) => setGoal(res.data.data))
      .catch(() => router.back())
      .finally(() => setLoading(false));
  }, [id]);

  async function handleToggle() {
    if (!goal) return;
    setToggling(true);
    try {
      await apiClient.patch(`/api/goals/${goal.id}`, { isActive: !goal.isActive });
      setGoal((p) => p ? { ...p, isActive: !p.isActive } : p);
    } catch { /* */ } finally { setToggling(false); }
  }

  function handleDelete() {
    Alert.alert('목표 삭제', '이 목표를 삭제하시겠어요?\n관련 로드맵도 함께 삭제됩니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제', style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.delete(`/api/goals/${goal?.id}`);
            router.back();
          } catch { /* */ }
        },
      },
    ]);
  }

  async function handleGenerateRoadmap() {
    if (!goal) return;
    setGenerating(true);
    try {
      await apiClient.post('/api/roadmap/generate', { goalId: goal.id });
      router.push('/(app)/roadmap');
    } catch { setGenerating(false); }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8F8F6] items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color="#111111" />
      </SafeAreaView>
    );
  }

  if (!goal) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F6]" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
            <Text className="text-[#111111] text-2xl">‹</Text>
          </Pressable>
          <Text className="text-[17px] font-semibold text-[#111111]">목표 상세</Text>
        </View>
        <Pressable onPress={handleDelete}>
          <Text className="text-[13px] font-medium text-[#E05C5C]">삭제</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="gap-4 pb-8 pt-2">
          {/* 목표 헤더 */}
          <View className="bg-white rounded-[20px] px-5 py-5">
            <View className="flex-row items-center gap-3 mb-2">
              <Text className="text-3xl">{TYPE_ICONS[goal.type] ?? '⭐'}</Text>
              <View className="flex-1">
                <Text className="text-[11px] text-[#8E8E93] mb-0.5">{TYPE_LABELS[goal.type] ?? goal.type}</Text>
                <Text className="text-[18px] font-bold text-[#111111]">{goal.title}</Text>
              </View>
              {!goal.isActive && (
                <Text className="text-[11px] text-[#C7C7CC] bg-[#F0F0EE] px-2 py-0.5 rounded-full">일시 중지</Text>
              )}
            </View>
            {goal.targetDescription && (
              <Text className="text-[14px] text-[#8E8E93] leading-relaxed">{goal.targetDescription}</Text>
            )}
          </View>

          {/* 진행률 */}
          <View className="bg-white rounded-[20px] px-5 py-5">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[14px] font-semibold text-[#111111]">현재 진행률</Text>
              <Text className="text-[16px] font-bold text-[#111111]">{goal.progressPercent}%</Text>
            </View>
            <View className="h-2.5 bg-[#F0F0EE] rounded-full overflow-hidden">
              <View className="h-full bg-[#111111] rounded-full" style={{ width: `${goal.progressPercent}%` }} />
            </View>
          </View>

          {/* 학습 계획 */}
          <View className="bg-white rounded-[20px] px-5 py-5 gap-3">
            <Text className="text-[14px] font-semibold text-[#111111]">학습 계획</Text>
            {[
              ['1회 학습 시간', `${goal.preferredMinutesPerSession}분`],
              ['주간 학습 횟수', `주 ${goal.preferredSessionsPerWeek}회`],
              ['주간 총 학습', `${goal.preferredMinutesPerSession * goal.preferredSessionsPerWeek}분/주`],
            ].map(([label, value]) => (
              <View key={label} className="flex-row items-center justify-between">
                <Text className="text-[13px] text-[#8E8E93]">{label}</Text>
                <Text className="text-[13px] font-semibold text-[#111111]">{value}</Text>
              </View>
            ))}
          </View>

          {/* 버튼 */}
          <Pressable
            onPress={handleGenerateRoadmap}
            disabled={generating}
            className="h-[52px] bg-[#111111] rounded-[16px] items-center justify-center"
          >
            {generating
              ? <ActivityIndicator size="small" color="white" />
              : <Text className="text-white text-[15px] font-semibold">AI 로드맵 생성</Text>
            }
          </Pressable>

          <Pressable
            onPress={handleToggle}
            disabled={toggling}
            className={`h-[52px] rounded-[16px] items-center justify-center border ${
              goal.isActive ? 'bg-white border-[#EFEFEF]' : 'bg-white border-[#111111]'
            }`}
          >
            <Text className={`text-[15px] font-semibold ${goal.isActive ? 'text-[#8E8E93]' : 'text-[#111111]'}`}>
              {toggling ? '처리 중...' : goal.isActive ? '목표 일시 중지' : '목표 재개'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
