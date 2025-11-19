import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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

type FormState = {
  name: string;
  dosage: string;
  schedule: string;
  memo: string;
};

const initialForm: FormState = {
  name: '',
  dosage: '',
  schedule: '',
  memo: '',
};

export default function AddMedicineScreen() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.schedule.trim()) {
      Alert.alert('필수 정보', '약 이름과 복용 시간을 입력해주세요.');
      return;
    }
    Alert.alert('등록 완료', `${form.name} 복용 일정이 등록되었습니다.`, [
      {
        text: '확인',
        onPress: () => {
          setForm(initialForm);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>약 등록</Text>
          <Text style={styles.subtitle}>복용할 약 정보를 입력하면 홈 화면에 표시돼요.</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>약 이름</Text>
            <TextInput
              value={form.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholder="예) 혈압약"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.formRowItem]}>
              <Text style={styles.label}>복용량</Text>
              <TextInput
                value={form.dosage}
                onChangeText={(text) => handleChange('dosage', text)}
                placeholder="1정"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>
            <View style={[styles.formGroup, styles.formRowItem]}>
              <Text style={styles.label}>시간</Text>
              <TextInput
                value={form.schedule}
                onChangeText={(text) => handleChange('schedule', text)}
                placeholder="오전 8:00"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>메모</Text>
            <TextInput
              value={form.memo}
              onChangeText={(text) => handleChange('memo', text)}
              placeholder="특이 사항 또는 복용 팁을 남겨주세요"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              style={[styles.input, styles.memoInput]}
            />
          </View>

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>등록하기</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4FFFB',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0C4C38',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7C73',
  },
  formGroup: {
    gap: 8,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formRowItem: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#1D2B28',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E1E4E8',
    color: '#111322',
  },
  memoInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: '#0C4C38',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

