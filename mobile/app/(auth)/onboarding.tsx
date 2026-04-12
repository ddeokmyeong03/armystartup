import { View, Text, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingPage() {
  return (
    <View className="flex-1 bg-[#F8F8F6] items-center justify-between px-6 pb-12 pt-20">
      <StatusBar style="dark" />

      {/* 로고 & 타이틀 */}
      <View className="flex-1 items-center justify-center gap-4">
        <View className="w-20 h-20 bg-[#111111] rounded-[24px] items-center justify-center mb-2">
          <Text className="text-white text-4xl font-bold">M</Text>
        </View>
        <Text className="text-3xl font-bold text-[#111111]">Millog</Text>
        <Text className="text-[15px] text-[#8E8E93] text-center leading-relaxed">
          군 복무 중 자기개발을{'\n'}체계적으로 관리하세요
        </Text>

        {/* 특징 목록 */}
        <View className="mt-8 gap-3 w-full">
          {[
            { icon: '📋', text: 'AI가 맞춤형 학습 로드맵 생성' },
            { icon: '📚', text: '장병e음 · K-MOOC 강의 추천' },
            { icon: '📅', text: '일정 관리와 피로도 분석' },
          ].map((item) => (
            <View key={item.text} className="flex-row items-center gap-3 bg-white rounded-[16px] px-4 py-3">
              <Text className="text-xl">{item.icon}</Text>
              <Text className="text-[14px] font-medium text-[#111111] flex-1">{item.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 버튼 */}
      <View className="w-full gap-3">
        <Pressable
          onPress={() => router.push('/(auth)/login')}
          className="h-[52px] bg-[#111111] rounded-[16px] items-center justify-center"
        >
          <Text className="text-white text-[15px] font-semibold">로그인</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(auth)/signup')}
          className="h-[52px] bg-white border border-[#EFEFEF] rounded-[16px] items-center justify-center"
        >
          <Text className="text-[#111111] text-[15px] font-semibold">회원가입</Text>
        </Pressable>
      </View>
    </View>
  );
}
