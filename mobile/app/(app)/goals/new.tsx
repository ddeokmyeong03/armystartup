import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '@/shared/lib/apiClient';

const GOAL_TYPES = [
  { value: 'STUDY', label: '공부' },
  { value: 'CERTIFICATE', label: '자격증' },
  { value: 'EXERCISE', label: '운동' },
  { value: 'READING', label: '독서' },
  { value: 'CODING', label: '코딩' },
  { value: 'OTHER', label: '기타' },
];

const SESSION_TIMES = [15, 30, 45, 60, 90, 120];
const WEEKLY_COUNTS = [1, 2, 3, 4, 5, 6, 7];

export default function GoalCreatePage() {
  const [form, setForm] = useState({
    title: '',
    type: 'STUDY',
    targetDescription: '',
    preferredMinutesPerSession: 30,
    preferredSessionsPerWeek: 3,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    if (!form.title.trim()) { setError('목표 제목을 입력해주세요.'); return; }
    setLoading(true);
    try {
      await apiClient.post('/api/goals', {
        title: form.title.trim(),
        type: form.type,
        targetDescription: form.targetDescription.trim() || undefined,
        preferredMinutesPerSession: form.preferredMinutesPerSession,
        preferredSessionsPerWeek: form.preferredSessionsPerWeek,
      });
      router.back();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? '목표 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F6]" edges={['top']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="flex-row items-center gap-3 px-5 pt-4 pb-2">
          <Pressable onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
            <Text className="text-[#111111] text-2xl">‹</Text>
          </Pressable>
          <Text className="text-[17px] font-semibold text-[#111111]">목표 추가</Text>
        </View>

        <ScrollView className="flex-1 px-5" keyboardShouldPersistTaps="handled">
          <View className="gap-4 pt-2 pb-8">
            {/* 제목 */}
            <View className="gap-1">
              <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">목표 제목 *</Text>
              <TextInput
                value={form.title}
                onChangeText={(v) => setForm((p) => ({ ...p, title: v }))}
                placeholder="예: 컴퓨터활용능력 1급 취득"
                placeholderTextColor="#C7C7CC"
                className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111]"
              />
            </View>

            {/* 목표 유형 */}
            <View className="gap-2">
              <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">목표 유형</Text>
              <View className="flex-row flex-wrap gap-2">
                {GOAL_TYPES.map((t) => (
                  <Pressable
                    key={t.value}
                    onPress={() => setForm((p) => ({ ...p, type: t.value }))}
                    className={`px-4 py-2 rounded-full ${form.type === t.value ? 'bg-[#111111]' : 'bg-white'}`}
                  >
                    <Text className={`text-[13px] font-medium ${form.type === t.value ? 'text-white' : 'text-[#8E8E93]'}`}>
                      {t.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* 설명 */}
            <View className="gap-1">
              <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">목표 설명 (선택)</Text>
              <TextInput
                value={form.targetDescription}
                onChangeText={(v) => setForm((p) => ({ ...p, targetDescription: v }))}
                placeholder="달성하고 싶은 구체적인 내용"
                placeholderTextColor="#C7C7CC"
                multiline
                numberOfLines={3}
                className="bg-white rounded-[14px] px-4 py-3 text-[15px] text-[#111111]"
                style={{ textAlignVertical: 'top', minHeight: 80 }}
              />
            </View>

            {/* 1회 학습 시간 */}
            <View className="gap-2">
              <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">
                1회 학습 시간: <Text className="text-[#111111]">{form.preferredMinutesPerSession}분</Text>
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {SESSION_TIMES.map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setForm((p) => ({ ...p, preferredMinutesPerSession: t }))}
                    className={`px-4 py-2 rounded-full ${form.preferredMinutesPerSession === t ? 'bg-[#111111]' : 'bg-white'}`}
                  >
                    <Text className={`text-[13px] font-medium ${form.preferredMinutesPerSession === t ? 'text-white' : 'text-[#8E8E93]'}`}>
                      {t}분
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* 주간 학습 횟수 */}
            <View className="gap-2">
              <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">
                주 학습 횟수: <Text className="text-[#111111]">주 {form.preferredSessionsPerWeek}회</Text>
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {WEEKLY_COUNTS.map((n) => (
                  <Pressable
                    key={n}
                    onPress={() => setForm((p) => ({ ...p, preferredSessionsPerWeek: n }))}
                    className={`px-4 py-2 rounded-full ${form.preferredSessionsPerWeek === n ? 'bg-[#111111]' : 'bg-white'}`}
                  >
                    <Text className={`text-[13px] font-medium ${form.preferredSessionsPerWeek === n ? 'text-white' : 'text-[#8E8E93]'}`}>
                      {n}회
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {error ? <Text className="text-[13px] text-[#E05C5C] pl-1">{error}</Text> : null}

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className="h-[52px] bg-[#111111] rounded-[16px] items-center justify-center mt-2"
            >
              <Text className="text-white text-[15px] font-semibold">
                {loading ? '저장 중...' : '목표 추가'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
