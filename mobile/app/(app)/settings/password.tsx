import { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '@/shared/lib/apiClient';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setError('');
    if (form.newPassword.length < 8) { setError('새 비밀번호는 8자 이상이어야 합니다.'); return; }
    if (form.newPassword !== form.confirmPassword) { setError('새 비밀번호가 일치하지 않습니다.'); return; }
    setLoading(true);
    try {
      await apiClient.patch('/api/users/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? '비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8F8F6] items-center justify-center px-5 gap-5" edges={['top']}>
        <View className="w-16 h-16 bg-[#E8F4E8] rounded-full items-center justify-center">
          <Text className="text-3xl">✓</Text>
        </View>
        <Text className="text-[18px] font-bold text-[#111111]">비밀번호 변경 완료</Text>
        <Pressable onPress={() => router.back()} className="w-full h-[52px] bg-[#111111] rounded-[16px] items-center justify-center">
          <Text className="text-white text-[15px] font-semibold">확인</Text>
        </Pressable>
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
          <Text className="text-[17px] font-semibold text-[#111111]">비밀번호 변경</Text>
        </View>

        <ScrollView className="flex-1 px-5" keyboardShouldPersistTaps="handled">
          <View className="gap-4 pt-2 pb-8">
            {[
              { key: 'currentPassword', label: '현재 비밀번호', placeholder: '현재 비밀번호 입력' },
              { key: 'newPassword', label: '새 비밀번호', placeholder: '8자 이상 입력' },
              { key: 'confirmPassword', label: '새 비밀번호 확인', placeholder: '새 비밀번호 재입력' },
            ].map((f) => (
              <View key={f.key} className="gap-1">
                <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">{f.label}</Text>
                <TextInput
                  value={form[f.key as keyof typeof form]}
                  onChangeText={(v) => { setForm((p) => ({ ...p, [f.key]: v })); setError(''); }}
                  placeholder={f.placeholder}
                  placeholderTextColor="#C7C7CC"
                  secureTextEntry
                  className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111]"
                />
              </View>
            ))}

            {error ? <Text className="text-[13px] text-[#E05C5C] pl-1">{error}</Text> : null}

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className="h-[52px] bg-[#111111] rounded-[16px] items-center justify-center mt-2"
            >
              <Text className="text-white text-[15px] font-semibold">
                {loading ? '변경 중...' : '비밀번호 변경'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
