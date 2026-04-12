import { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { login } from '@/shared/lib/auth';
import apiClient from '@/shared/lib/apiClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post<{
        data: { accessToken: string; user: { nickname: string } };
      }>('/api/auth/login', { email: email.trim(), password });
      await login(res.data.data.accessToken, res.data.data.user.nickname);
      router.replace('/(app)');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F8F8F6]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        {/* 헤더 */}
        <View className="flex-row items-center gap-3 px-5 pt-14 pb-4">
          <Pressable onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
            <Text className="text-[#111111] text-xl">‹</Text>
          </Pressable>
          <Text className="text-[17px] font-semibold text-[#111111]">로그인</Text>
        </View>

        <View className="flex-1 px-5 pt-2 gap-4">
          {/* 이메일 */}
          <View className="gap-1">
            <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">이메일</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="이메일을 입력하세요"
              placeholderTextColor="#C7C7CC"
              keyboardType="email-address"
              autoCapitalize="none"
              className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111]"
            />
          </View>

          {/* 비밀번호 */}
          <View className="gap-1">
            <Text className="text-[12px] font-semibold text-[#8E8E93] pl-1">비밀번호</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력하세요"
              placeholderTextColor="#C7C7CC"
              secureTextEntry
              className="h-[50px] bg-white rounded-[14px] px-4 text-[15px] text-[#111111]"
            />
          </View>

          {error ? <Text className="text-[13px] text-[#E05C5C] pl-1">{error}</Text> : null}

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className="h-[52px] bg-[#111111] rounded-[16px] items-center justify-center mt-2 disabled:opacity-50"
          >
            <Text className="text-white text-[15px] font-semibold">
              {loading ? '로그인 중...' : '로그인'}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push('/(auth)/signup')} className="items-center py-3">
            <Text className="text-[13px] text-[#8E8E93]">
              계정이 없으신가요?{' '}
              <Text className="text-[#111111] font-semibold">회원가입</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
