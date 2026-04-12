import AsyncStorage from '@react-native-async-storage/async-storage';

export async function isLoggedIn(): Promise<boolean> {
  const token = await AsyncStorage.getItem('accessToken');
  return !!token;
}

export async function login(token: string, nickname: string): Promise<void> {
  await AsyncStorage.multiSet([
    ['accessToken', token],
    ['nickname', nickname],
  ]);
}

export async function logout(): Promise<void> {
  await AsyncStorage.multiRemove(['accessToken', 'nickname']);
}

export async function getNickname(): Promise<string> {
  const stored = await AsyncStorage.getItem('nickname');
  if (!stored || stored === 'undefined' || stored === 'null') return '사용자';
  return stored;
}
