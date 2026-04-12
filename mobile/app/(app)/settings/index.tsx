import { useState } from 'react';
import { View, Text, Pressable, Switch } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsPage() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [scheduleReminder, setScheduleReminder] = useState(true);
  const [courseAlert, setCourseAlert] = useState(true);
  const [goalReminder, setGoalReminder] = useState(false);

  const sections = [
    {
      title: '알림',
      items: [
        { label: '푸시 알림', desc: '모든 알림을 켜거나 끕니다', value: pushEnabled, onChange: setPushEnabled },
        { label: '일정 알림', desc: '일정 30분 전에 알려드려요', value: scheduleReminder, onChange: setScheduleReminder },
        { label: '강의 추천 알림', desc: '새 AI 추천 강의 도착 시 알림', value: courseAlert, onChange: setCourseAlert },
        { label: '목표 리마인더', desc: '매일 저녁 목표 현황 알림', value: goalReminder, onChange: setGoalReminder },
      ],
    },
  ];

  const accountItems = [
    { label: '프로필 수정', onPress: () => router.push('/(app)/profile/edit') },
    { label: '비밀번호 변경', onPress: () => router.push('/(app)/settings/password') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F6]" edges={['top']}>
      <View className="flex-row items-center gap-3 px-5 pt-4 pb-4">
        <Pressable onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
          <Text className="text-[#111111] text-2xl">‹</Text>
        </Pressable>
        <Text className="text-[17px] font-semibold text-[#111111]">설정</Text>
      </View>

      <View className="flex-1 px-5 gap-4">
        {/* 알림 설정 */}
        <View className="bg-white rounded-[20px] overflow-hidden">
          <Text className="px-5 pt-4 pb-2 text-[12px] font-semibold text-[#8E8E93] uppercase">알림</Text>
          {sections[0].items.map((item, idx) => (
            <View
              key={item.label}
              className={`flex-row items-center px-5 py-4 ${idx < sections[0].items.length - 1 ? 'border-b border-[#F0F0F0]' : ''}`}
            >
              <View className="flex-1">
                <Text className="text-[15px] font-medium text-[#111111]">{item.label}</Text>
                <Text className="text-[12px] text-[#8E8E93] mt-0.5">{item.desc}</Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.onChange}
                trackColor={{ false: '#D1D1D6', true: '#111111' }}
                thumbColor="white"
              />
            </View>
          ))}
        </View>

        {/* 계정 */}
        <View className="bg-white rounded-[20px] overflow-hidden">
          <Text className="px-5 pt-4 pb-2 text-[12px] font-semibold text-[#8E8E93] uppercase">계정</Text>
          {accountItems.map((item, idx) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              className={`flex-row items-center justify-between px-5 py-4 ${idx < accountItems.length - 1 ? 'border-b border-[#F0F0F0]' : ''}`}
            >
              <Text className="text-[15px] font-medium text-[#111111]">{item.label}</Text>
              <Text className="text-[#C7C7CC] text-lg">›</Text>
            </Pressable>
          ))}
        </View>

        {/* 앱 정보 */}
        <View className="bg-white rounded-[20px] px-5 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-[15px] font-medium text-[#111111]">버전</Text>
            <Text className="text-[14px] text-[#8E8E93]">v1.0.0</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
