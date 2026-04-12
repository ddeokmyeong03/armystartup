import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '@/shared/lib/apiClient';

type Goal = {
  id: number;
  title: string;
  type: string;
  targetDescription?: string;
  preferredMinutesPerSession: number;
  preferredSessionsPerWeek: number;
  isActive: boolean;
};

const TYPE_COLORS: Record<string, string> = {
  STUDY: 'bg-[#DCE8F8] text-[#4A7BAF]',
  CERTIFICATE: 'bg-[#FDE8F0] text-[#C05080]',
  EXERCISE: 'bg-[#E8F4E8] text-[#3A7D44]',
  READING: 'bg-[#FFF3DC] text-[#B07830]',
  CODING: 'bg-[#EDE8F8] text-[#6040A0]',
  OTHER: 'bg-[#EFEFEF] text-[#8E8E93]',
};

const TYPE_LABELS: Record<string, string> = {
  STUDY: '공부', CERTIFICATE: '자격증', EXERCISE: '운동',
  READING: '독서', CODING: '코딩', OTHER: '기타',
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(() => {
    apiClient
      .get<{ data: Goal[] }>('/api/goals')
      .then((res) => setGoals(res.data.data ?? []))
      .catch(() => setGoals([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  async function handleToggle(goal: Goal) {
    try {
      await apiClient.patch(`/api/goals/${goal.id}`, { isActive: !goal.isActive });
      setGoals((prev) => prev.map((g) => g.id === goal.id ? { ...g, isActive: !g.isActive } : g));
    } catch { /* ignore */ }
  }

  function handleDelete(goal: Goal) {
    Alert.alert('목표 삭제', '이 목표를 삭제하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.delete(`/api/goals/${goal.id}`);
            setGoals((prev) => prev.filter((g) => g.id !== goal.id));
          } catch { /* ignore */ }
        },
      },
    ]);
  }

  const active = goals.filter((g) => g.isActive);
  const inactive = goals.filter((g) => !g.isActive);

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F6]" edges={['top']}>
      <View className="flex-row items-center gap-3 px-5 pt-4 pb-2">
        <Pressable onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
          <Text className="text-[#111111] text-2xl">‹</Text>
        </Pressable>
        <Text className="text-[20px] font-bold text-[#111111] flex-1">목표 관리</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center py-16">
            <Text className="text-[#8E8E93]">로딩 중...</Text>
          </View>
        ) : goals.length === 0 ? (
          <View className="items-center py-16 gap-2">
            <Text className="text-[40px]">🎯</Text>
            <Text className="text-[15px] font-semibold text-[#111111]">목표가 없어요</Text>
            <Text className="text-[13px] text-[#8E8E93]">+ 버튼으로 목표를 추가해보세요</Text>
          </View>
        ) : (
          <View className="pb-24 gap-4 mt-2">
            {active.length > 0 && (
              <View>
                <Text className="text-[12px] font-semibold text-[#8E8E93] mb-2 pl-1">진행 중 ({active.length})</Text>
                <View className="gap-2">
                  {active.map((g) => (
                    <GoalCard key={g.id} goal={g} onToggle={() => handleToggle(g)} onDelete={() => handleDelete(g)} />
                  ))}
                </View>
              </View>
            )}
            {inactive.length > 0 && (
              <View className="opacity-60">
                <Text className="text-[12px] font-semibold text-[#8E8E93] mb-2 pl-1">일시 중지 ({inactive.length})</Text>
                <View className="gap-2">
                  {inactive.map((g) => (
                    <GoalCard key={g.id} goal={g} onToggle={() => handleToggle(g)} onDelete={() => handleDelete(g)} />
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <Pressable
        onPress={() => router.push('/(app)/goals/new')}
        className="absolute bottom-6 right-5 w-12 h-12 bg-[#111111] rounded-full items-center justify-center shadow-lg"
      >
        <Text className="text-white text-2xl font-light">+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function GoalCard({ goal, onToggle, onDelete }: { goal: Goal; onToggle: () => void; onDelete: () => void }) {
  const typeColor = TYPE_COLORS[goal.type] ?? TYPE_COLORS.OTHER;
  const typeLabel = TYPE_LABELS[goal.type] ?? goal.type;

  return (
    <Pressable
      onPress={() => router.push(`/(app)/goals/${goal.id}` as any)}
      className="bg-white rounded-[16px] px-4 py-4"
    >
      <View className="flex-row items-start gap-3">
        <View className="flex-1 min-w-0">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeColor}`}>{typeLabel}</Text>
            {!goal.isActive && <Text className="text-[11px] text-[#C7C7CC]">일시 중지</Text>}
          </View>
          <Text className="text-[15px] font-semibold text-[#111111]" numberOfLines={1}>{goal.title}</Text>
          {goal.targetDescription && (
            <Text className="text-[12px] text-[#8E8E93] mt-0.5" numberOfLines={2}>{goal.targetDescription}</Text>
          )}
          <Text className="text-[12px] text-[#8E8E93] mt-1.5">
            회당 {goal.preferredMinutesPerSession}분 · 주 {goal.preferredSessionsPerWeek}회
          </Text>
        </View>

        <View className="items-end gap-1">
          <Pressable
            onPress={onToggle}
            className={`px-3 py-1 rounded-full ${goal.isActive ? 'bg-[#EFEFEF]' : 'bg-[#111111]'}`}
          >
            <Text className={`text-[11px] font-medium ${goal.isActive ? 'text-[#8E8E93]' : 'text-white'}`}>
              {goal.isActive ? '중지' : '재개'}
            </Text>
          </Pressable>
          <Pressable onPress={onDelete}>
            <Text className="text-[11px] font-medium text-[#E05C5C] px-3 py-1">삭제</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}
