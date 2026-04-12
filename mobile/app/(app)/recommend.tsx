import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '@/shared/lib/apiClient';

type Recommendation = {
  id: number;
  course: {
    id: number;
    title: string;
    source: string;
    category: string;
    durationMinutes: number;
    url: string;
    tags: string;
    description: string;
  };
  reason: string;
  priority: number;
  goalTitle?: string;
};

const SOURCE_LABELS: Record<string, string> = {
  JANGBYEONGEEUM: '장병e음',
  DEFENSE_TRANSITION: '국방전직',
  K_MOOC: 'K-MOOC',
};

const CATEGORY_COLORS: Record<string, string> = {
  LANGUAGE: 'bg-[#DCE8F8] text-[#4A7BAF]',
  IT: 'bg-[#EDE8F8] text-[#6040A0]',
  CERTIFICATE: 'bg-[#FDE8F0] text-[#C05080]',
  EXERCISE: 'bg-[#E8F4E8] text-[#3A7D44]',
  LEADERSHIP: 'bg-[#FFF3DC] text-[#B07830]',
  OTHER: 'bg-[#EFEFEF] text-[#8E8E93]',
};

const CATEGORY_LABELS: Record<string, string> = {
  LANGUAGE: '어학', IT: 'IT', CERTIFICATE: '자격증',
  EXERCISE: '운동', LEADERSHIP: '리더십', OTHER: '기타',
};

export default function RecommendPage() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchSaved();
  }, []);

  async function fetchSaved() {
    setLoading(true);
    try {
      const res = await apiClient.get<{ data: any[] }>('/api/courses/saved');
      setRecs(res.data.data ?? []);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }

  async function handleRecommend() {
    setRequesting(true);
    try {
      const res = await apiClient.post<{ data: { recommendations: Recommendation[] } }>('/api/courses/recommend');
      setRecs(res.data.data.recommendations ?? []);
    } catch {
      //
    } finally {
      setRequesting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F6]" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-[22px] font-bold text-[#111111]">강의 추천</Text>
          <Text className="text-[13px] text-[#8E8E93] mt-0.5">AI가 추천하는 맞춤 강의</Text>
        </View>

        <View className="px-5 pb-8 gap-4">
          <Pressable
            onPress={handleRecommend}
            disabled={requesting}
            className="h-[52px] bg-[#3A3A3A] rounded-[16px] items-center justify-center flex-row gap-2"
          >
            {requesting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-[15px] font-bold text-white">✨ 목표 기반 강의 추천받기</Text>
            )}
          </Pressable>

          {loading ? (
            <View className="items-center py-12">
              <ActivityIndicator size="large" color="#111111" />
            </View>
          ) : recs.length === 0 ? (
            <View className="bg-white rounded-[20px] px-5 py-12 items-center gap-2">
              <Text className="text-[40px]">📚</Text>
              <Text className="text-[15px] font-semibold text-[#111111]">추천 강의가 없어요</Text>
              <Text className="text-[13px] text-[#8E8E93] text-center">
                위 버튼을 눌러{'\n'}AI 강의 추천을 받아보세요
              </Text>
            </View>
          ) : (
            recs.map((rec) => {
              let tags: string[] = [];
              try { tags = JSON.parse(rec.course.tags); } catch { tags = []; }
              const catColor = CATEGORY_COLORS[rec.course.category] ?? CATEGORY_COLORS.OTHER;
              const catLabel = CATEGORY_LABELS[rec.course.category] ?? rec.course.category;
              const srcLabel = SOURCE_LABELS[rec.course.source] ?? rec.course.source;

              return (
                <View key={rec.id} className="bg-white rounded-[20px] px-5 py-4 gap-2">
                  <View className="flex-row items-center gap-2">
                    <Text className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${catColor}`}>
                      {catLabel}
                    </Text>
                    <Text className="text-[11px] text-[#8E8E93]">{srcLabel}</Text>
                    <Text className="text-[11px] text-[#8E8E93] ml-auto">⏱ {rec.course.durationMinutes}분</Text>
                  </View>

                  <Text className="text-[15px] font-bold text-[#111111]">{rec.course.title}</Text>

                  <View className="bg-[#F8F8F6] rounded-[12px] px-3 py-2.5">
                    <Text className="text-[11px] font-semibold text-[#4A7BAF] mb-0.5">AI 추천 이유</Text>
                    <Text className="text-[12px] text-[#8E8E93] leading-relaxed">{rec.reason}</Text>
                  </View>

                  {tags.length > 0 && (
                    <View className="flex-row flex-wrap gap-1">
                      {tags.slice(0, 4).map((tag) => (
                        <Text key={tag} className="text-[10px] text-[#8E8E93] bg-[#F0F0EE] px-2 py-0.5 rounded-full">
                          #{tag}
                        </Text>
                      ))}
                    </View>
                  )}

                  <Pressable
                    onPress={() => Linking.openURL(rec.course.url)}
                    className="h-[40px] bg-[#111111] rounded-[12px] items-center justify-center"
                  >
                    <Text className="text-white text-[13px] font-semibold">강의 바로가기 →</Text>
                  </Pressable>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
