import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import apiClient from '@/shared/lib/apiClient';

const CATEGORIES = [
  { value: 'DUTY', label: '근무' },
  { value: 'TRAINING', label: '훈련' },
  { value: 'ROLLCALL', label: '점호' },
  { value: 'PERSONAL', label: '개인' },
  { value: 'STUDY', label: '자기개발' },
  { value: 'REST', label: '휴식' },
  { value: 'OTHER', label: '기타' },
];

export default function ScheduleCreatePage() {
  const [form, setForm] = useState({
    title: '',
    scheduleDate: dayjs().format('YYYY-MM-DD'),
    startTime: '09:00',
    endTime: '10:00',
    category: 'PERSONAL',
    memo: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    if (!form.title.trim()) { setError('일정 제목을 입력해주세요.'); return; }
    if (form.startTime >= form.endTime) { setError('종료 시간은 시작 시간보다 늦어야 합니다.'); return; }
    setLoading(true);
    try {
      await apiClient.post('/api/schedules', {
        title: form.title.trim(),
        scheduleDate: form.scheduleDate,
        startTime: form.startTime,
        endTime: form.endTime,
        category: form.category,
        repeatType: 'NONE',
        memo: form.memo.trim() || undefined,
      });
      router.back();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? '저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F6]" edges={['top']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="flex-row items-center gap-3 px-5 pt-4 pb-4">
          <Pressable onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
            <Text className="text-[#111111] text-2xl">‹</Text>
          </Pressable>
          <Text className="text-[17px] font-semibold text-[#111111]">일정 추가</Text>
        </View>

        <ScrollView className="flex-1 px-5" keyboardShouldPersistTaps="handled">
          <View className="gap-4 pt-2 pb-8">
            {/* 제목 */}
            <View className="gap-1">
              <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">일정 제목 *</Text>
              <TextInput
                value={form.title}
                onChangeText={(v) => setForm((p) => ({ ...p, title: v }))}
                placeholder="예: 점호, 개인 운동"
                placeholderTextColor="#C7C7CC"
                maxLength={50}
                className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111]"
              />
            </View>

            {/* 날짜 */}
            <View className="gap-1">
              <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">날짜</Text>
              <TextInput
                value={form.scheduleDate}
                onChangeText={(v) => setForm((p) => ({ ...p, scheduleDate: v }))}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#C7C7CC"
                className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111]"
              />
            </View>

            {/* 시간 */}
            <View className="flex-row gap-3">
              <View className="flex-1 gap-1">
                <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">시작 시간</Text>
                <TextInput
                  value={form.startTime}
                  onChangeText={(v) => setForm((p) => ({ ...p, startTime: v }))}
                  placeholder="HH:MM"
                  placeholderTextColor="#C7C7CC"
                  className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111]"
                />
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">종료 시간</Text>
                <TextInput
                  value={form.endTime}
                  onChangeText={(v) => setForm((p) => ({ ...p, endTime: v }))}
                  placeholder="HH:MM"
                  placeholderTextColor="#C7C7CC"
                  className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111]"
                />
              </View>
            </View>

            {/* 카테고리 */}
            <View className="gap-2">
              <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">카테고리</Text>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.value}
                    onPress={() => setForm((p) => ({ ...p, category: cat.value }))}
                    className={`px-4 py-2 rounded-full ${form.category === cat.value ? 'bg-[#111111]' : 'bg-white'}`}
                  >
                    <Text className={`text-[13px] font-medium ${form.category === cat.value ? 'text-white' : 'text-[#8E8E93]'}`}>
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* 메모 */}
            <View className="gap-1">
              <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">메모 (선택)</Text>
              <TextInput
                value={form.memo}
                onChangeText={(v) => setForm((p) => ({ ...p, memo: v }))}
                placeholder="추가 메모를 입력하세요"
                placeholderTextColor="#C7C7CC"
                multiline
                numberOfLines={3}
                maxLength={200}
                className="bg-white rounded-[14px] px-4 py-3 text-[15px] text-[#111111]"
                style={{ textAlignVertical: 'top', minHeight: 80 }}
              />
            </View>

            {error ? <Text className="text-[13px] text-[#E05C5C] pl-1">{error}</Text> : null}

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className="h-[52px] bg-[#111111] rounded-[16px] items-center justify-center mt-2"
            >
              <Text className="text-white text-[15px] font-semibold">
                {loading ? '저장 중...' : '일정 추가'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
