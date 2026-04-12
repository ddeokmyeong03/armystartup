import '../global.css';
import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { isLoggedIn } from '@/shared/lib/auth';

export default function RootLayout() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    isLoggedIn().then((loggedIn) => {
      if (!loggedIn) {
        router.replace('/(auth)/onboarding');
      }
      setChecked(true);
    });
  }, []);

  if (!checked) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
