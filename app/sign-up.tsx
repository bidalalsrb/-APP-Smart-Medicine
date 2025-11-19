import type { ComponentProps } from 'react';
import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Modal,
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
  muted: '#F4F7FB',
  border: '#E4E7EC',
  text: '#111322',
  secondaryText: '#6F7787',
  primary: '#080A0F',
  success: '#14A44D',
  error: '#D72D2D',
};

const agreementsList = [
  { id: 'terms', label: '서비스 이용약관 (필수)', required: true },
  { id: 'privacy', label: '개인정보 수집 및 이용 (필수)', required: true },
  { id: 'location', label: '위치기반 서비스 이용약관 (필수)', required: true },
  { id: 'marketing', label: '마케팅 정보 수신 (선택)', required: false },
];

const genders = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
];

export default function SignUpScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    userId: '',
    password: '',
    confirmPassword: '',
    birth: '',
    gender: '',
    phone: '',
    code: '',
  });
  const [idCheckStatus, setIdCheckStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [idMessage, setIdMessage] = useState('');
  const [phoneStatus, setPhoneStatus] = useState<'idle' | 'sent' | 'verified'>('idle');
  const [error, setError] = useState('');
  const [showAgreements, setShowAgreements] = useState(false);
  const [agreements, setAgreements] = useState(() =>
    agreementsList.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {})
  );

  const requiredAgreed = useMemo(
    () => agreementsList.filter((item) => item.required).every((item) => agreements[item.id]),
    [agreements]
  );
  const allAgreed = useMemo(
    () => agreementsList.every((item) => agreements[item.id]),
    [agreements]
  );

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
    if (key === 'userId') {
      setIdCheckStatus('idle');
      setIdMessage('');
    }
  };

  const handleIdCheck = () => {
    if (!form.userId.trim()) {
      setIdCheckStatus('error');
      setIdMessage('아이디를 입력해주세요.');
      return;
    }
    if (form.userId.toLowerCase() === 'smartmedi' || form.userId.length < 4) {
      setIdCheckStatus('error');
      setIdMessage('사용할 수 없는 아이디입니다.');
      return;
    }
    setIdCheckStatus('success');
    setIdMessage('사용 가능한 아이디입니다.');
  };

  const passwordMismatch =
    form.confirmPassword.length > 0 && form.confirmPassword !== form.password;

  const handleSendCode = () => {
    if (!form.phone.trim()) {
      setError('휴대폰 번호를 입력해주세요.');
      return;
    }
    setPhoneStatus('sent');
  };

  const handleVerifyCode = () => {
    if (!form.code.trim()) {
      setError('인증번호를 입력해주세요.');
      return;
    }
    setPhoneStatus('verified');
  };

  const toggleAgreement = (id: string, value?: boolean) => {
    setAgreements((prev) => ({
      ...prev,
      [id]: typeof value === 'boolean' ? value : !prev[id],
    }));
  };

  const toggleAllAgreements = () => {
    const next = !allAgreed;
    const updated: Record<string, boolean> = {};
    agreementsList.forEach((item) => {
      updated[item.id] = next;
    });
    setAgreements(updated);
  };

  const handleRegister = () => {
    if (!form.name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    if (idCheckStatus !== 'success') {
      setError('아이디 중복 확인을 완료해주세요.');
      return;
    }
    if (form.password.length < 8) {
      setError('비밀번호는 8자 이상 입력해주세요.');
      return;
    }
    if (passwordMismatch) {
      setError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    if (!form.birth.trim() || form.birth.length < 8) {
      setError('생년월일을 YYYYMMDD 형식으로 입력해주세요.');
      return;
    }
    if (!form.gender) {
      setError('성별을 선택해주세요.');
      return;
    }
    if (phoneStatus !== 'verified') {
      setError('휴대폰 인증을 완료해주세요.');
      return;
    }
    if (!requiredAgreed) {
      setError('필수 약관에 동의해주세요.');
      return;
    }

    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>회원가입</Text>

          <InputField
            label="이름"
            value={form.name}
            placeholder="이름 입력"
            onChangeText={(text) => handleChange('name', text)}
          />

          <View style={styles.spacedRow}>
            <View style={{ flex: 1 }}>
              <InputField
                label="아이디"
                value={form.userId}
                placeholder="아이디 입력"
                autoCapitalize="none"
                onChangeText={(text) => handleChange('userId', text)}
                status={idCheckStatus}
              />
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.inlineButton,
                pressed && { opacity: 0.85 },
              ]}
              onPress={handleIdCheck}>
              <Text style={styles.inlineButtonText}>중복확인</Text>
            </Pressable>
          </View>
          {idMessage ? (
            <Text
              style={[
                styles.statusText,
                idCheckStatus === 'success' ? styles.successText : styles.errorText,
              ]}>
              {idMessage}
            </Text>
          ) : null}

          <InputField
            label="비밀번호"
            value={form.password}
            placeholder="영문, 숫자 조합 8자 이상"
            secureTextEntry
            onChangeText={(text) => handleChange('password', text)}
          />

          <InputField
            label="비밀번호 확인"
            value={form.confirmPassword}
            placeholder="비밀번호 다시 입력"
            secureTextEntry
            status={passwordMismatch ? 'error' : 'idle'}
            onChangeText={(text) => handleChange('confirmPassword', text)}
          />
          {passwordMismatch && (
            <Text style={[styles.statusText, styles.errorText]}>
              비밀번호 확인이 일치하지 않습니다.
            </Text>
          )}

          <View style={styles.rowGroup}>
            <View style={{ flex: 1 }}>
              <InputField
                label="생년월일"
                value={form.birth}
                placeholder="YYYYMMDD"
                keyboardType="number-pad"
                maxLength={8}
                onChangeText={(text) => handleChange('birth', text)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>성별</Text>
              <View style={styles.genderGroup}>
                {genders.map((gender) => (
                  <Pressable
                    key={gender.value}
                    style={[
                      styles.genderButton,
                      form.gender === gender.value && styles.genderButtonActive,
                    ]}
                    onPress={() => handleChange('gender', gender.value)}>
                    <Text
                      style={[
                        styles.genderText,
                        form.gender === gender.value && { color: '#fff' },
                      ]}>
                      {gender.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>휴대폰</Text>
            <View style={styles.spacedRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="01012345678"
                placeholderTextColor={palette.secondaryText}
                keyboardType="number-pad"
                value={form.phone}
                onChangeText={(text) => handleChange('phone', text)}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.inlineButton,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={handleSendCode}>
                <Text style={styles.inlineButtonText}>
                  {phoneStatus === 'idle' ? '인증요청' : '재전송'}
                </Text>
              </Pressable>
            </View>
            {phoneStatus === 'sent' && (
              <Text style={[styles.statusText, { color: palette.secondaryText }]}>
                인증번호를 발송했습니다.
              </Text>
            )}
            {phoneStatus === 'verified' && (
              <Text style={[styles.statusText, styles.successText]}>
                휴대폰 인증이 완료되었습니다.
              </Text>
            )}
            <View style={[styles.spacedRow, { marginTop: 12 }]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="인증번호 입력"
                placeholderTextColor={palette.secondaryText}
                keyboardType="number-pad"
                value={form.code}
                onChangeText={(text) => handleChange('code', text)}
              />
              <Pressable
                disabled={phoneStatus !== 'sent'}
                style={({ pressed }) => [
                  styles.inlineButton,
                  phoneStatus !== 'sent' && styles.disabledButton,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={handleVerifyCode}>
                <Text style={styles.inlineButtonText}>확인</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.agreementCard}>
            <View style={styles.agreementHeader}>
              <Text style={styles.label}>약관동의</Text>
              {requiredAgreed ? (
                <Text style={[styles.statusText, styles.successText]}>필수 약관 동의 완료</Text>
              ) : (
                <Text style={[styles.statusText, styles.errorText]}>필수 약관 미동의</Text>
              )}
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && { backgroundColor: '#EEF0F4' },
              ]}
              onPress={() => setShowAgreements(true)}>
              <Text style={styles.secondaryButtonText}>
                {requiredAgreed ? '동의 내역 보기' : '약관동의'}
              </Text>
            </Pressable>
          </View>

          {error ? <Text style={[styles.statusText, styles.errorText]}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.85 },
            ]}
            onPress={handleRegister}>
            <Text style={styles.primaryButtonText}>회원가입</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showAgreements}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAgreements(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>메디베이브 서비스 약관에 동의해주세요.</Text>
          <Pressable style={styles.modalAllRow} onPress={toggleAllAgreements}>
            <Checkbox checked={allAgreed} />
            <Text style={styles.modalAllText}>전체 동의하기</Text>
          </Pressable>
          <View style={styles.modalList}>
            {agreementsList.map((item) => (
              <Pressable
                key={item.id}
                style={styles.modalItem}
                onPress={() => toggleAgreement(item.id)}>
                <Checkbox checked={agreements[item.id]} />
                <Text style={styles.modalItemText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            disabled={!requiredAgreed}
            style={[
              styles.primaryButton,
              !requiredAgreed && styles.disabledButton,
              { marginTop: 'auto' },
            ]}
            onPress={() => setShowAgreements(false)}>
            <Text style={styles.primaryButtonText}>
              {requiredAgreed ? '동의하고 돌아가기' : '필수 약관을 선택해주세요'}
            </Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

type InputFieldProps = ComponentProps<typeof TextInput> & {
  label: string;
  status?: 'idle' | 'success' | 'error';
};

function InputField({ label, status = 'idle', style, ...rest }: InputFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        placeholderTextColor={rest.placeholderTextColor ?? palette.secondaryText}
        style={[
          styles.input,
          style,
          status === 'success' && styles.inputSuccess,
          status === 'error' && styles.inputError,
        ]}
      />
    </View>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
    </View>
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
    fontSize: 24,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
    marginBottom: 6,
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
  inputSuccess: {
    borderColor: palette.success,
  },
  inputError: {
    borderColor: palette.error,
  },
  spacedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowGroup: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  inlineButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  inlineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.text,
  },
  statusText: {
    fontSize: 13,
    marginBottom: 12,
  },
  successText: {
    color: palette.success,
  },
  errorText: {
    color: palette.error,
  },
  genderGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  genderText: {
    color: palette.text,
    fontWeight: '600',
  },
  agreementCard: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  agreementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    color: palette.text,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
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
  modalContainer: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 24,
  },
  modalAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modalAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.text,
  },
  modalList: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  modalItemText: {
    fontSize: 15,
    color: palette.text,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: palette.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    borderColor: palette.primary,
    backgroundColor: palette.primary,
  },
  checkboxMark: {
    color: '#fff',
    fontWeight: '700',
  },
});
