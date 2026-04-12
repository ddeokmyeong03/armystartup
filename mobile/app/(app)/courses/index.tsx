import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Linking, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '@/shared/lib/apiClient';

type Course = {
  id: number;
  title: string;
  source: string;
  category: string;
  durationMinutes: number;
  url: string;
  tags: string;
  description: string;
};

const SOURCE_FILTERS = [
  { value: '', label: '전체' },
  { value: 'JANGBYEONGEEUM', label: '장병e음' },
  { value: 'DEFENSE_TRANSITION', label: '국방전직' },
  { value: 'K_MOOC', label: 'K-MOOC' },
];

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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = sourceFilter ? `?source=${sourceFilter}` : '';
    apiClient
      .get<{ data: { courses: Course[] } }>(`/api/courses${params}`)
      .then((res) => setCourses(res.data.data.courses ?? []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [sourceFilter]);

  const filtered = search.trim()
    ? courses.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase()),
      )
    : courses;

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F6]" edges={['top']}>
      <View className="flex-row items-center gap-3 px-5 pt-4 pb-2">
        <Pressable onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
          <Text className="text-[#111111] text-2xl">‹</Text>
        </Pressable>
        <View className="flex-1">
          <Text className="text-[17px] font-semibold text-[#111111]">강의 목록</Text>
          <Text className="text-[12px] text-[#8E8E93]">총 {filtered.length}개</Text>
        </View>
      </View>

      {/* 검색 */}
      <View className="px-5 pb-2">
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="강의 검색..."
          placeholderTextColor="#C7C7CC"
          className="h-[44px] bg-white rounded-[12px] px-4 text-[14px] text-[#111111]"
        />
      </View>

      {/* 출처 필터 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 pb-3" contentContainerStyle={{ gap: 8 }}>
        {SOURCE_FILTERS.map((f) => (
          <Pressable
            key={f.value}
            onPress={() => setSourceFilter(f.value)}
            className={`px-4 py-2 rounded-full ${sourceFilter === f.value ? 'bg-[#111111]' : 'bg-white'}`}
          >
            <Text className={`text-[13px] font-medium ${sourceFilter === f.value ? 'text-white' : 'text-[#8E8E93]'}`}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* 강의 목록 */}
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#111111" />
          </View>
        ) : filtered.length === 0 ? (
          <View className="items-center py-12 gap-2">
            <Text className="text-[40px]">📚</Text>
            <Text className="text-[15px] font-semibold text-[#111111]">강의가 없습니다</Text>
          </View>
        ) : (
          <View className="gap-3 pb-8">
            {filtered.map((course) => {
              let tags: string[] = [];
              try { tags = JSON.parse(course.tags); } catch { tags = []; }
              const catColor = CATEGORY_COLORS[course.category] ?? CATEGORY_COLORS.OTHER;
              const catLabel = CATEGORY_LABELS[course.category] ?? course.category;

              return (
                <Pressable
                  key={course.id}
                  onPress={() => Linking.openURL(course.url)}
                  className="bg-white rounded-[16px] px-4 py-4 gap-2"
                >
                  <View className="flex-row items-center gap-2">
                    <Text className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${catColor}`}>{catLabel}</Text>
                    <Text className="text-[10px] text-[#8E8E93]">{SOURCE_LABELS[course.source]}</Text>
                    <Text className="text-[11px] text-[#8E8E93] ml-auto">⏱ {course.durationMinutes}분</Text>
                  </View>
                  <Text className="text-[15px] font-semibold text-[#111111]">{course.title}</Text>
                  <Text className="text-[12px] text-[#8E8E93] leading-relaxed" numberOfLines={2}>{course.description}</Text>
                  {tags.length > 0 && (
                    <View className="flex-row flex-wrap gap-1">
                      {tags.slice(0, 4).map((tag) => (
                        <Text key={tag} className="text-[10px] text-[#8E8E93] bg-[#F0F0EE] px-2 py-0.5 rounded-full">#{tag}</Text>
                      ))}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
