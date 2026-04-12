import { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { login } from '@/shared/lib/auth';
import apiClient from '@/shared/lib/apiClient';

export default function SignupPage() {
  const [form, setForm] = useState({ nickname: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  }

  async function handleSignup() {
    setError('');
    if (!form.nickname.trim() || !form.email.trim() || !form.password) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    if (form.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/api/auth/signup', {
        nickname: form.nickname.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      const loginRes = await apiClient.post<{
        data: { accessToken: string; user: { nickname: string } };
      }>('/api/auth/login', { email: form.email.trim(), password: form.password });
      await login(loginRes.data.data.accessToken, loginRes.data.data.user.nickname);
      router.replace('/(app)');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { key: 'nickname', label: '닉네임', placeholder: '사용할 닉네임 입력', keyboard: 'default' as const, secure: false },
    { key: 'email', label: '이메일', placeholder: '이메일 주소 입력', keyboard: 'email-address' as const, secure: false },
    { key: 'password', label: '비밀번호', placeholder: '8자 이상 입력', keyboard: 'default' as const, secure: true },
    { key: 'confirmPassword', label: '비밀번호 확인', placeholder: '비밀번호 재입력', keyboard: 'default' as const, secure: true },
  ];

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F8F8F6]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center gap-3 px-5 pt-14 pb-4">
          <Pressable onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
            <Text className="text-[#111111] text-xl">‹</Text>
          </Pressable>
          <Text className="text-[17px] font-semibold text-[#111111]">회원가입</Text>
        </View>

        <View className="flex-1 px-5 pt-2 gap-4">
          {fields.map((f) => (
            <View key={f.key} className="gap-1">
              <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">{f.label}</Text>
              <TextInput
                value={form[f.key as keyof typeof form]}
                onChangeText={(v) => update(f.key, v)}
                placeholder={f.placeholder}
                placeholderTextColor="#C7C7CC"
                keyboardType={f.keyboard}
                autoCapitalize="none"
                secureTextEntry={f.secure}
                className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111]"
              />
            </View>
          ))}

          {error ? <Text className="text-[13px] text-[#E05C5C] pl-1">{error}</Text> : null}

          <Pressable
            onPress={handleSignup}
            disabled={loading}
            className="h-[52px] bg-[#111111] rounded-[16px] items-center justify-center mt-2"
          >
            <Text className="text-white text-[15px] font-semibold">
              {loading ? '가입 중...' : '회원가입'}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push('/(auth)/login')} className="items-center py-3">
            <Text className="text-[13px] text-[#8E8E93]">
              이미 계정이 있으신가요?{' '}
              <Text className="text-[#111111] font-semibold">로그인</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
