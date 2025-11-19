import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const palette = {
  background: '#FFFFFF',
  muted: '#F6F7FB',
  divider: '#E4E7EC',
  text: '#111322',
  secondaryText: '#6F7787',
  primary: '#080A0F',
  error: '#E03C31',
  accent: '#00A86B',
};

const socialButtons = [
  { id: 'facebook', label: 'Facebook으로 계속하기' },
  { id: 'google', label: 'Google로 계속하기' },
];

export default function LoginScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = () => {
    const trimmedUserId = userId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUserId || !trimmedPassword) {
      setError(true);
      return;
    }

    if (trimmedUserId === 'admin' && trimmedPassword === '1234') {
      setError(false);
      router.replace('/(tabs)');
      return;
    }

    setError(true);
  };

  const handleTyping = (setter: (value: string) => void) => (value: string) => {
    setError(false);
    setter(value);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <View style={styles.logoBadge}>
            <Text style={styles.logoPlus}>+</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>아이디</Text>
            <TextInput
              value={userId}
              onChangeText={handleTyping(setUserId)}
              placeholder="예) abcdef1234"
              placeholderTextColor={palette.secondaryText}
              autoCapitalize="none"
              style={[styles.input, error && styles.inputError]}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              value={password}
              onChangeText={handleTyping(setPassword)}
              placeholder="***********"
              placeholderTextColor={palette.secondaryText}
              secureTextEntry
              style={[styles.input, error && styles.inputError]}
            />
            {error && (
              <Text style={styles.errorText}>아이디 혹은 비밀번호가 일치하지 않습니다.</Text>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>로그인</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && { backgroundColor: '#EEF0F4' },
            ]}
            onPress={() => router.push('/sign-up')}>
            <Text style={styles.secondaryButtonText}>회원가입</Text>
          </Pressable>

          <Link href="/forgot-password" style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>비밀번호를 잊으셨나요?</Text>
          </Link>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>Or Login with</Text>
            <View style={styles.line} />
          </View>

          {socialButtons.map((button) => (
            <Pressable
              key={button.id}
              style={({ pressed }) => [
                styles.socialButton,
                pressed && { borderColor: palette.text },
              ]}
              onPress={() => {}}>
              <Text style={styles.socialButtonText}>{button.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: palette.muted,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
    alignSelf: 'center',
  },
  logoPlus: {
    fontSize: 32,
    fontWeight: '700',
    color: palette.accent,
  },
  formSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: palette.text,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.divider,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    backgroundColor: '#fff',
    color: palette.text,
  },
  inputError: {
    borderColor: palette.error,
    backgroundColor: '#FFF6F5',
  },
  errorText: {
    marginTop: 8,
    fontSize: 13,
    color: palette.error,
  },
  primaryButton: {
    backgroundColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: palette.divider,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  forgotPasswordText: {
    fontSize: 13,
    color: palette.secondaryText,
    textDecorationLine: 'underline',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.divider,
  },
  dividerText: {
    fontSize: 12,
    color: palette.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: palette.divider,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: palette.text,
  },
});
