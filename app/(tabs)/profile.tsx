import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const profileSections = [
  { id: 'id', label: '아이디', value: 'smartmedi01', helper: '가입 시 등록한 아이디 노출' },
  { id: 'name', label: '이름', value: '김혜민', helper: '운영자에게만 노출' },
  { id: 'phone', label: '체크인 전화', value: '010-1234-5678', helper: '지정한 번호로 알림 안내' },
  { id: 'branch', label: '지점', value: '본점', helper: '소속 지점을 확인하세요.' },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>마이페이지</Text>
            <Text style={styles.subtitle}>내 계정 정보를 확인하고 관리할 수 있어요.</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>김</Text>
          </View>
        </View>

        {profileSections.map((section, index) => (
          <View key={section.id} style={styles.fieldCard}>
            <View style={styles.fieldHeader}>
              <View style={styles.indexBadge}>
                <Text style={styles.indexBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.fieldLabel}>{section.label}</Text>
            </View>
            <TextInput editable={false} value={section.value} style={styles.fieldInput} />
            <Text style={styles.fieldHelper}>{section.helper}</Text>
          </View>
        ))}

        <View style={styles.fieldCard}>
          <View style={styles.fieldHeader}>
            <View style={styles.indexBadge}>
              <Text style={styles.indexBadgeText}>5</Text>
            </View>
            <Text style={styles.fieldLabel}>비밀번호 변경</Text>
          </View>
          <TextInput editable={false} value="********" style={styles.fieldInput} />
          <Text style={styles.fieldHelper}>정기적으로 비밀번호를 변경하고 보안을 유지하세요.</Text>
          <Pressable style={styles.linkButton} onPress={() => router.push('/change-password')}>
            <Text style={styles.linkButtonText}>비밀번호 변경하기</Text>
          </Pressable>
        </View>

        <View style={styles.fieldCard}>
          <View style={styles.fieldHeader}>
            <View style={styles.indexBadge}>
              <Text style={styles.indexBadgeText}>6</Text>
            </View>
            <Text style={styles.fieldLabel}>로그아웃</Text>
          </View>
          <Pressable style={styles.logoutButton}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </Pressable>
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>마이메디</Text>
          <Text style={styles.supportSubtitle}>운영시간 09:00-18:00 | help@smartmedi.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F0E8',
  },
  container: {
    padding: 20,
    gap: 16,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C1A18',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#6B7280',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111322',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  fieldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  indexBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FEEBD8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexBadgeText: {
    color: '#B2621D',
    fontWeight: '700',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B273A',
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#E4E6EC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1B273A',
    backgroundColor: '#F8F8FB',
  },
  fieldHelper: {
    fontSize: 12,
    color: '#8A909F',
  },
  linkButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#0E8265',
  },
  linkButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#111322',
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111322',
  },
  supportCard: {
    backgroundColor: '#FFF6E8',
    borderRadius: 20,
    padding: 18,
    gap: 6,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7A531F',
  },
  supportSubtitle: {
    fontSize: 13,
    color: '#A1783E',
  },
});

