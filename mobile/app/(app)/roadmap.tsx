import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '@/shared/lib/apiClient';

type RoadmapStage = {
  week: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  items: string[];
};

type Roadmap = {
  id: number;
  title: string;
  totalWeeks: number;
  progressPercent: number;
  stages: RoadmapStage[];
  goal?: { title: string; type: string };
};

type Goal = { id: number; title: string; type: string };

const STATUS_COLORS = {
  completed: 'bg-[#E8F4E8] border-[#3A7D44]',
  in_progress: 'bg-[#DCE8F8] border-[#4A7BAF]',
  pending: 'bg-white border-[#EFEFEF]',
};

const STATUS_LABELS = {
  completed: '완료',
  in_progress: '진행 중',
  pending: '예정',
};

export default function RoadmapPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [rmRes, goalRes] = await Promise.all([
        apiClient.get<{ data: any[] }>('/api/roadmap'),
        apiClient.get<{ data: Goal[] }>('/api/goals'),
      ]);
      setRoadmaps(rmRes.data.data ?? []);
      setGoals((goalRes.data.data ?? []).filter((g: any) => g.isActive));
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(goalId: number) {
    setGenerating(true);
    try {
      await apiClient.post('/api/roadmap/generate', { goalId });
      await fetchData();
    } catch {
      //
    } finally {
      setGenerating(false);
    }
  }

  async function handleStageToggle(roadmapId: number, stageIndex: number, current: string) {
    const newStatus = current === 'completed' ? 'pending' : 'completed';
    try {
      await apiClient.patch(`/api/roadmap/${roadmapId}/stage`, { stageIndex, status: newStatus });
      setRoadmaps((prev) =>
        prev.map((r) => {
          if (r.id !== roadmapId) return r;
          const stages = r.stages.map((s, i) =>
            i === stageIndex ? { ...s, status: newStatus as RoadmapStage['status'] } : s,
          );
          const completed = stages.filter((s) => s.status === 'completed').length;
          return { ...r, stages, progressPercent: Math.round((completed / stages.length) * 100) };
        }),
      );
    } catch {
      //
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8F8F6] items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color="#111111" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F6]" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-[22px] font-bold text-[#111111]">학습 로드맵</Text>
          <Text className="text-[13px] text-[#8E8E93] mt-0.5">AI가 생성한 맞춤 학습 계획</Text>
        </View>

        <View className="px-5 pb-8 gap-4">
          {/* 로드맵 생성 */}
          {goals.length > 0 && (
            <View className="bg-white rounded-[20px] px-5 py-4">
              <Text className="text-[14px] font-semibold text-[#111111] mb-3">목표 기반 로드맵 생성</Text>
              <View className="gap-2">
                {goals.slice(0, 3).map((g) => (
                  <Pressable
                    key={g.id}
                    onPress={() => handleGenerate(g.id)}
                    disabled={generating}
                    className="flex-row items-center justify-between bg-[#F8F8F6] rounded-[12px] px-4 py-3"
                  >
                    <Text className="text-[13px] font-medium text-[#111111] flex-1 mr-2" numberOfLines={1}>{g.title}</Text>
                    <Text className="text-[12px] text-[#4A7BAF] font-semibold">
                      {generating ? '생성 중...' : '생성 →'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {roadmaps.length === 0 ? (
            <View className="bg-white rounded-[20px] px-5 py-12 items-center gap-2">
              <Text className="text-[40px]">🗺️</Text>
              <Text className="text-[15px] font-semibold text-[#111111]">로드맵이 없어요</Text>
              <Text className="text-[13px] text-[#8E8E93] text-center">
                목표를 먼저 생성하고{'\n'}AI 로드맵을 만들어보세요.
              </Text>
            </View>
          ) : (
            roadmaps.map((rm) => (
              <View key={rm.id} className="bg-white rounded-[20px] px-5 py-4">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-[15px] font-bold text-[#111111] flex-1 mr-2" numberOfLines={1}>{rm.title}</Text>
                  <Text className="text-[14px] font-bold text-[#111111]">{rm.progressPercent}%</Text>
                </View>
                {rm.goal?.title && (
                  <Text className="text-[12px] text-[#8E8E93] mb-2">목표: {rm.goal.title}</Text>
                )}
                <View className="h-2 bg-[#F0F0EE] rounded-full overflow-hidden mb-4">
                  <View className="h-full bg-[#111111] rounded-full" style={{ width: `${rm.progressPercent}%` }} />
                </View>

                <View className="gap-2">
                  {rm.stages.map((stage, idx) => {
                    const key = `${rm.id}-${idx}`;
                    const expanded = expandedStage === key;
                    return (
                      <View key={key} className={`border rounded-[14px] overflow-hidden ${STATUS_COLORS[stage.status]}`}>
                        <Pressable
                          className="flex-row items-center px-4 py-3 gap-3"
                          onPress={() => setExpandedStage(expanded ? null : key)}
                        >
                          <Pressable
                            onPress={() => handleStageToggle(rm.id, idx, stage.status)}
                            className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                              stage.status === 'completed'
                                ? 'bg-[#3A7D44] border-[#3A7D44]'
                                : 'bg-white border-[#C7C7CC]'
                            }`}
                          >
                            {stage.status === 'completed' && (
                              <Text className="text-white text-[10px]">✓</Text>
                            )}
                          </Pressable>
                          <View className="flex-1">
                            <Text className="text-[11px] text-[#8E8E93]">{stage.week}</Text>
                            <Text className="text-[13px] font-semibold text-[#111111]">{stage.title}</Text>
                          </View>
                          <Text className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            stage.status === 'completed'
                              ? 'text-[#3A7D44]'
                              : stage.status === 'in_progress'
                              ? 'text-[#4A7BAF]'
                              : 'text-[#8E8E93]'
                          }`}>
                            {STATUS_LABELS[stage.status]}
                          </Text>
                          <Text className="text-[#C7C7CC]">{expanded ? '▲' : '▼'}</Text>
                        </Pressable>

                        {expanded && (
                          <View className="px-4 pb-3 gap-1">
                            {stage.items.map((item, i) => (
                              <View key={i} className="flex-row items-center gap-2">
                                <View className="w-1 h-1 rounded-full bg-[#8E8E93]" />
                                <Text className="text-[12px] text-[#8E8E93]">{item}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
