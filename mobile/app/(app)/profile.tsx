import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import { getNickname, logout } from '@/shared/lib/auth';
import apiClient from '@/shared/lib/apiClient';

type UserProfile = {
  wakeUpTime: string;
  sleepTime: string;
  availableStudyMinutes: number;
  preferredPlanIntensity: string;
  dischargeDate?: string;
  unitName?: string;
  rankName?: string;
};

const INTENSITY_LABEL: Record<string, string> = {
  LOW: '여유롭게', MEDIUM: '적당하게', HIGH: '집중적으로',
};

export default function ProfilePage() {
  const [nickname, setNickname] = useState('사용자');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getNickname().then(setNickname);
    apiClient
      .get<{ data: UserProfile }>('/api/profiles/me')
      .then((res) => setProfile(res.data.data))
      .catch(() => {});
  }, []);

  function handleLogout() {
    Alert.alert('로그아웃', '로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/onboarding');
        },
      },
    ]);
  }

  const daysLeft = profile?.dischargeDate
    ? dayjs(profile.dischargeDate).diff(dayjs(), 'day')
    : null;

  const menuItems = [
    { label: '프로필 수정', icon: '👤', route: '/(app)/profile/edit' },
    { label: '강의 목록', icon: '📚', route: '/(app)/courses/index' },
    { label: '알림', icon: '🔔', route: '/(app)/notifications' },
    { label: '목표 관리', icon: '🎯', route: '/(app)/goals/index' },
    { label: '설정', icon: '⚙️', route: '/(app)/settings/index' },
  ] as const;

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F6]" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-[22px] font-bold text-[#111111]">내 정보</Text>
        </View>

        <View className="px-5 pb-8 gap-4">
          {/* 프로필 카드 */}
          <View className="bg-white rounded-[20px] px-5 py-5 flex-row items-center gap-4">
            <View className="w-14 h-14 bg-[#111111] rounded-full items-center justify-center">
              <Text className="text-white text-xl font-bold">
                {nickname.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-[17px] font-bold text-[#111111]">{nickname}</Text>
              <View className="flex-row items-center gap-2 mt-0.5">
                {profile?.rankName && (
                  <Text className="text-[12px] text-[#4A7BAF] font-medium">{profile.rankName}</Text>
                )}
                {profile?.unitName && (
                  <Text className="text-[12px] text-[#8E8E93]">{profile.unitName}</Text>
                )}
                {!profile?.rankName && !profile?.unitName && (
                  <Text className="text-[12px] text-[#8E8E93]">Millog 사용자</Text>
                )}
              </View>
            </View>
          </View>

          {/* 전역 D-day */}
          {daysLeft !== null && (
            <View className={`rounded-[16px] px-4 py-3 flex-row items-center gap-3 ${
              daysLeft < 0 ? 'bg-[#E8F4E8]' : daysLeft <= 90 ? 'bg-[#FFF3DC]' : 'bg-[#DCE8F8]'
            }`}>
              <Text className="text-2xl">📅</Text>
              <View className="flex-1">
                <Text className={`text-[11px] font-medium ${
                  daysLeft < 0 ? 'text-[#3A7D44]' : daysLeft <= 90 ? 'text-[#B07830]' : 'text-[#4A7BAF]'
                }`}>
                  {daysLeft < 0 ? '전역 완료' : '전역까지'}
                </Text>
                <Text className={`text-[20px] font-bold leading-tight ${
                  daysLeft < 0 ? 'text-[#3A7D44]' : daysLeft <= 90 ? 'text-[#B07830]' : 'text-[#4A7BAF]'
                }`}>
                  {daysLeft < 0 ? '전역했습니다!' : `D-${daysLeft}`}
                </Text>
              </View>
              <Text className="text-[12px] text-[#8E8E93]">{profile?.dischargeDate}</Text>
            </View>
          )}

          {/* 자기개발 설정 요약 */}
          {profile && (
            <View className="bg-white rounded-[20px] px-5 py-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-[14px] font-semibold text-[#111111]">자기개발 설정</Text>
                <Pressable onPress={() => router.push('/(app)/profile/edit')}>
                  <Text className="text-[12px] text-[#4A7BAF] font-medium">수정</Text>
                </Pressable>
              </View>
              <View className="gap-2">
                {[
                  { label: '기상 시간', value: profile.wakeUpTime },
                  { label: '취침 시간', value: profile.sleepTime },
                  { label: '하루 가용 시간', value: `${profile.availableStudyMinutes}분` },
                  { label: '학습 강도', value: INTENSITY_LABEL[profile.preferredPlanIntensity] ?? profile.preferredPlanIntensity },
                ].map((row) => (
                  <View key={row.label} className="flex-row items-center justify-between">
                    <Text className="text-[13px] text-[#8E8E93]">{row.label}</Text>
                    <Text className="text-[13px] font-medium text-[#111111]">{row.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 메뉴 */}
          <View className="bg-white rounded-[20px] overflow-hidden">
            {menuItems.map((item, idx) => (
              <Pressable
                key={item.label}
                onPress={() => router.push(item.route as any)}
                className={`flex-row items-center gap-4 px-5 py-4 ${
                  idx < menuItems.length - 1 ? 'border-b border-[#F0F0F0]' : ''
                }`}
              >
                <Text className="text-lg">{item.icon}</Text>
                <Text className="text-[15px] font-medium text-[#111111] flex-1">{item.label}</Text>
                <Text className="text-[#C7C7CC] text-lg">›</Text>
              </Pressable>
            ))}
          </View>

          {/* 로그아웃 */}
          <Pressable
            onPress={handleLogout}
            className="bg-white rounded-[20px] px-5 py-4 flex-row items-center gap-4"
          >
            <Text className="text-lg">🚪</Text>
            <Text className="text-[15px] font-medium text-[#E05C5C]">로그아웃</Text>
          </Pressable>

          <Text className="text-center text-[12px] text-[#C7C7CC]">Millog v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
