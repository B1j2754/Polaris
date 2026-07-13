import * as SecureStore from 'expo-secure-store';
import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';
import { Platform } from 'react-native';

const KEY = 'session';

const storage = {
  get: (): Promise<string | null> =>
    Platform.OS === 'web'
      ? Promise.resolve(localStorage.getItem(KEY))
      : SecureStore.getItemAsync(KEY),
  set: (token: string | null) => {
    if (Platform.OS === 'web') {
      token === null ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, token);
      return;
    }
    token === null ? SecureStore.deleteItemAsync(KEY) : SecureStore.setItemAsync(KEY, token);
  },
};

const AuthContext = createContext<{
  session: string | null;
  isLoading: boolean;
  signIn: (token?: string) => void;
  signOut: () => void;
} | null>(null);

export function useSession() {
  const value = use(AuthContext);
  if (!value) throw new Error('useSession must be used inside <SessionProvider>');
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage
      .get()
      .then(setSession)
      .finally(() => setIsLoading(false));
  }, []);

  const save = (token: string | null) => {
    setSession(token);
    storage.set(token);
  };

  return (
    <AuthContext
      value={{
        session,
        isLoading,
        signIn: (token = 'dev-token') => save(token),
        signOut: () => save(null),
      }}>
      {children}
    </AuthContext>
  );
}
