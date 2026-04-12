import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsPage() {
  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F6]" edges={['top']}>
      <View className="flex-row items-center gap-3 px-5 pt-4 pb-4">
        <Pressable onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
          <Text className="text-[#111111] text-2xl">‹</Text>
        </Pressable>
        <Text className="text-[17px] font-semibold text-[#111111]">알림</Text>
      </View>

      <View className="flex-1 items-center justify-center gap-3 pb-20">
        <Text className="text-[48px]">🔔</Text>
        <Text className="text-[16px] font-semibold text-[#111111]">알림이 없습니다</Text>
        <Text className="text-[13px] text-[#8E8E93] text-center leading-relaxed">
          새로운 알림이 도착하면{'\n'}여기에 표시됩니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}
