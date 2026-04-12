import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '@/shared/lib/apiClient';

type UserInfo = { email: string; nickname: string; phoneNumber?: string };

export default function ProfileEditPage() {
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({ nickname: '', phoneNumber: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .get<{ data: UserInfo }>('/api/users/me')
      .then((res) => {
        setEmail(res.data.data.email);
        setForm({ nickname: res.data.data.nickname ?? '', phoneNumber: res.data.data.phoneNumber ?? '' });
      })
      .catch(() => setError('정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!form.nickname.trim()) { setError('닉네임을 입력해주세요.'); return; }
    setSaving(true);
    try {
      await apiClient.patch('/api/users/me', {
        nickname: form.nickname.trim(),
        phoneNumber: form.phoneNumber.trim() || undefined,
      });
      await AsyncStorage.setItem('nickname', form.nickname.trim());
      router.back();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8F8F6] items-center justify-center" edges={['top']}>
        <Text className="text-[#8E8E93]">로딩 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F6]" edges={['top']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="flex-row items-center gap-3 px-5 pt-4 pb-4">
          <Pressable onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
            <Text className="text-[#111111] text-2xl">‹</Text>
          </Pressable>
          <Text className="text-[17px] font-semibold text-[#111111]">프로필 수정</Text>
        </View>

        <ScrollView className="flex-1 px-5" keyboardShouldPersistTaps="handled">
          <View className="gap-4 pt-2 pb-8">
            {/* 이메일 (읽기 전용) */}
            <View className="gap-1">
              <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">이메일</Text>
              <View className="h-[50px] bg-[#EFEFEF] rounded-[14px] px-4 justify-center">
                <Text className="text-[15px] text-[#8E8E93]">{email}</Text>
              </View>
              <Text className="text-[11px] text-[#C7C7CC] pl-1">이메일은 변경할 수 없습니다.</Text>
            </View>

            {/* 닉네임 */}
            <View className="gap-1">
              <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">닉네임 *</Text>
              <TextInput
                value={form.nickname}
                onChangeText={(v) => { setForm((p) => ({ ...p, nickname: v })); setError(''); }}
                placeholder="닉네임을 입력하세요"
                placeholderTextColor="#C7C7CC"
                maxLength={20}
                className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111]"
              />
            </View>

            {/* 전화번호 */}
            <View className="gap-1">
              <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">전화번호 (선택)</Text>
              <TextInput
                value={form.phoneNumber}
                onChangeText={(v) => setForm((p) => ({ ...p, phoneNumber: v }))}
                placeholder="010-0000-0000"
                placeholderTextColor="#C7C7CC"
                keyboardType="phone-pad"
                maxLength={13}
                className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111]"
              />
            </View>

            {error ? <Text className="text-[13px] text-[#E05C5C] pl-1">{error}</Text> : null}

            <Pressable
              onPress={handleSave}
              disabled={saving}
              className="h-[52px] bg-[#111111] rounded-[16px] items-center justify-center mt-2"
            >
              <Text className="text-white text-[15px] font-semibold">
                {saving ? '저장 중...' : '저장'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
