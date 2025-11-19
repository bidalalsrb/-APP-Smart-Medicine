import { useRouter } from 'expo-router';
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
  text: '#111322',
  secondaryText: '#6F7787',
  border: '#E4E7EC',
  muted: '#F4F7FB',
  primary: '#080A0F',
};

const domainOptions = [
  { label: '선택', value: '' },
  { label: 'naver.com', value: 'naver.com' },
  { label: 'gmail.com', value: 'gmail.com' },
  { label: 'daum.net', value: 'daum.net' },
  { label: '직접 입력', value: 'custom' },
];

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [form, setForm] = useState({
    name: '',
    userId: '',
    confirmId: '',
    emailLocal: '',
    domain: '',
    customDomain: '',
  });
  const [showSelector, setShowSelector] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  };

  const handleDomainSelect = (value: string) => {
    handleChange('domain', value);
    if (value !== 'custom') {
      handleChange('customDomain', '');
    }
    setShowSelector(false);
  };

  const resolvedDomain =
    form.domain === 'custom' ? form.customDomain.trim() : form.domain.trim();

  const handleNext = () => {
    if (
      !form.name.trim() ||
      !form.userId.trim() ||
      form.userId.trim() !== form.confirmId.trim() ||
      !form.emailLocal.trim() ||
      !resolvedDomain
    ) {
      setError('입력값을 다시 확인해주세요.');
      return;
    }
    setStep('result');
  };

  if (step === 'result') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>비밀번호 찾기</Text>
          <Text style={styles.description}>
            가입 시 입력하신 이메일로 비밀번호 변경 안내를 보내드렸습니다. 다음 안내가 도착하지 않을 경우
            입력값을 다시 확인한 뒤 시도해주세요.
          </Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultEmail}>
              {form.emailLocal}@{resolvedDomain}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => router.replace('/')}>
            <Text style={styles.primaryButtonText}>돌아가기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          style={styles.container}>
          <Text style={styles.title}>비밀번호 찾기</Text>
          <Text style={styles.description}>
            가입 시 사용하셨던 정보를 통해서 계정을 다시 확인해볼게요.
          </Text>

          <View style={styles.formSection}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="이름 입력"
              placeholderTextColor={palette.secondaryText}
              value={form.name}
              onChangeText={(text) => handleChange('name', text)}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>아이디</Text>
            <TextInput
              style={styles.input}
              placeholder="아이디 입력"
              placeholderTextColor={palette.secondaryText}
              autoCapitalize="none"
              value={form.userId}
              onChangeText={(text) => handleChange('userId', text)}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>아이디 확인</Text>
            <TextInput
              style={styles.input}
              placeholder="아이디 다시 입력"
              placeholderTextColor={palette.secondaryText}
              autoCapitalize="none"
              value={form.confirmId}
              onChangeText={(text) => handleChange('confirmId', text)}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>이메일</Text>
            <View style={styles.emailRow}>
              <TextInput
                style={[styles.input, styles.emailInput]}
                placeholder="아이디"
                placeholderTextColor={palette.secondaryText}
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.emailLocal}
                onChangeText={(text) => handleChange('emailLocal', text)}
              />
              <Text style={styles.atSymbol}>@</Text>
              <Pressable
                style={styles.selector}
                onPress={() => setShowSelector((prev) => !prev)}>
                <Text style={styles.selectorText}>
                  {form.domain === 'custom'
                    ? form.customDomain || '직접 입력'
                    : domainOptions.find((opt) => opt.value === form.domain)?.label ?? '선택'}
                </Text>
              </Pressable>
            </View>
            {showSelector && (
              <View style={styles.selectorMenu}>
                {domainOptions.map((option) => (
                  <Pressable
                    key={option.label}
                    style={styles.selectorMenuItem}
                    onPress={() => handleDomainSelect(option.value)}>
                    <Text style={styles.selectorMenuText}>{option.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}
            {form.domain === 'custom' && (
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                placeholder="도메인 입력 (예: company.com)"
                placeholderTextColor={palette.secondaryText}
                autoCapitalize="none"
                value={form.customDomain}
                onChangeText={(text) => handleChange('customDomain', text)}
              />
            )}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.85 },
            ]}
            onPress={handleNext}>
            <Text style={styles.primaryButtonText}>다음</Text>
          </Pressable>
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
    paddingTop: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.text,
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    color: palette.secondaryText,
    marginBottom: 24,
  },
  formSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: palette.text,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: palette.text,
    backgroundColor: '#fff',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailInput: {
    flex: 1,
  },
  atSymbol: {
    marginHorizontal: 8,
    fontSize: 16,
    color: palette.secondaryText,
  },
  selector: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    backgroundColor: palette.muted,
  },
  selectorText: {
    fontSize: 14,
    color: palette.text,
  },
  selectorMenu: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: '#fff',
  },
  selectorMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  selectorMenuText: {
    fontSize: 14,
    color: palette.text,
  },
  errorText: {
    color: '#D72D2D',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: palette.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultCard: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 14,
    padding: 24,
    marginVertical: 32,
    backgroundColor: palette.muted,
  },
  resultEmail: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.text,
    textAlign: 'center',
  },
});
