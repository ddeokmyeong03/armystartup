import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, color, size }: { name: IconName; color: string; size: number }) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#111111',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F0F0F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="roadmap"
        options={{
          title: '로드맵',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="map-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="recommend"
        options={{
          title: '추천',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="sparkles-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '내정보',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person-outline" color={color} size={size} />
          ),
        }}
      />
      {/* 숨긴 서브 화면들 */}
      <Tabs.Screen name="goals/index" options={{ href: null }} />
      <Tabs.Screen name="goals/new" options={{ href: null }} />
      <Tabs.Screen name="goals/[id]" options={{ href: null }} />
      <Tabs.Screen name="schedules/new" options={{ href: null }} />
      <Tabs.Screen name="schedules/[id]" options={{ href: null }} />
      <Tabs.Screen name="schedules/[id]/edit" options={{ href: null }} />
      <Tabs.Screen name="courses/index" options={{ href: null }} />
      <Tabs.Screen name="today" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="profile/edit" options={{ href: null }} />
      <Tabs.Screen name="settings/index" options={{ href: null }} />
      <Tabs.Screen name="settings/password" options={{ href: null }} />
    </Tabs>
  );
}
