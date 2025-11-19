import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Medication = {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  memo: string;
  status: '대기' | '복용완료';
};

type TimelineCard = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
};

const instructions = [
  '복용할 약 이름을 확인하세요.',
  '정해진 시간과 복용량을 확인하세요.',
  '물과 함께 천천히 복용하세요.',
  '복용 후 이상 반응을 10분간 관찰하세요.',
  '복용 기록을 남겨 두면 다음 관리가 쉬워져요.',
  '증상이 있다면 비고란에 꼭 기록해 주세요.',
];

const medications: Medication[] = [
  { id: 'morning', name: '혈압약', dosage: '1정', schedule: '오전 8:00', memo: '식후 30분', status: '복용완료' },
  { id: 'noon', name: '당뇨약', dosage: '2정', schedule: '오후 1:00', memo: '식전', status: '대기' },
  { id: 'night', name: '영양제', dosage: '1포', schedule: '오후 10:00', memo: '취침 전', status: '대기' },
];

const initialTimeline: TimelineCard[] = [
  { id: 't1', title: '3시간 47분', description: '복용 완료', timestamp: '2023.10.04 오후 8:10' },
  { id: 't2', title: '0시간 15분', description: '복용 대기', timestamp: '2023.10.05 오전 8:02' },
  { id: 't3', title: '30시간 20분', description: '미기록', timestamp: '2023.10.06 오후 11:00' },
];

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}시간 ${mins}분`;
};

export default function HomeScreen() {
  const router = useRouter();
  const [selectedMed, setSelectedMed] = useState('morning');
  const [timeline, setTimeline] = useState(initialTimeline);
  const [lastLoggedMinutes, setLastLoggedMinutes] = useState(0);

  const summary = useMemo(() => {
    const total = medications.length;
    const done = medications.filter((item) => item.status === '복용완료').length;
    return `${done}/${total} 복용`;
  }, []);

  const handleQuickLog = () => {
    const nextMinutes = lastLoggedMinutes + 75;
    setLastLoggedMinutes(nextMinutes);
    setTimeline((prev) => [
      {
        id: `t-${Date.now()}`,
        title: formatDuration(nextMinutes),
        description: '복용 기록 업데이트',
        timestamp: '방금 전',
      },
      ...prev,
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.appBar}>
          <Text style={styles.appTitle}>홈</Text>
          <Pressable style={styles.addButton} onPress={() => router.push('/add-medicine')}>
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>오늘 복용할 약</Text>
            <Text style={styles.summaryValue}>{summary}</Text>
          </View>
          <Pressable style={styles.sessionButton} onPress={() => router.push('/medication-session')}>
            <Text style={styles.sessionButtonText}>복용 진행</Text>
          </Pressable>
        </View>

        <View style={styles.medCard}>
          {medications.map((med) => {
            const isActive = med.id === selectedMed;
            return (
              <Pressable
                key={med.id}
                onPress={() => setSelectedMed(med.id)}
                style={[styles.medRow, isActive && styles.medRowActive]}>
                <View style={styles.medHeader}>
                  <View>
                    <Text style={styles.medName}>{med.name}</Text>
                    <Text style={styles.medMemo}>{med.memo}</Text>
                  </View>
                  <View style={[styles.statusChip, med.status === '복용완료' ? styles.statusDone : styles.statusWait]}>
                    <Text style={med.status === '복용완료' ? styles.statusTextDone : styles.statusTextWait}>
                      {med.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.medFooter}>
                  <Text style={styles.medDetail}>{med.schedule}</Text>
                  <Text style={styles.medDetail}>{med.dosage}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.quickCard}>
          <View>
            <Text style={styles.quickLabel}>오늘 복용 상태</Text>
            <Text style={styles.quickTimer}>{lastLoggedMinutes ? formatDuration(lastLoggedMinutes) : '복용 전입니다'}</Text>
            <Text style={styles.quickHint}>복용 버튼을 누르면 타이머와 기록이 업데이트됩니다.</Text>
          </View>
          <View style={styles.quickButtons}>
            <Pressable style={[styles.quickButton, styles.quickPrimary]} onPress={handleQuickLog}>
              <Text style={styles.quickPrimaryText}>복용했어요</Text>
            </Pressable>
            <Pressable style={[styles.quickButton, styles.quickSecondary]} onPress={() => router.push('/medication-session')}>
              <Text style={styles.quickSecondaryText}>상세 기록</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>복용 체크리스트</Text>
          {instructions.map((item, index) => (
            <View key={item} style={styles.instructionRow}>
              <View style={styles.instructionBadge}>
                <Text style={styles.instructionBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <Text style={styles.timelineTitle}>복용 기록</Text>
            <Text style={styles.timelineHint}>슬라이드하여 확인</Text>
          </View>
          <FlatList
            data={timeline}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 14 }}
            renderItem={({ item }) => (
              <View style={styles.timelineItem}>
                <Text style={styles.timelineValue}>{item.title}</Text>
                <Text style={styles.timelineDesc}>{item.description}</Text>
                <Text style={styles.timelineTime}>{item.timestamp}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2EEE5',
  },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 60,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1C1A18',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#11A569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B5E4A',
  },
  summaryValue: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: '800',
    color: '#1C1A18',
  },
  sessionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#0F9E6F',
  },
  sessionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    gap: 12,
  },
  medRow: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFE8DE',
    padding: 12,
    gap: 8,
  },
  medRowActive: {
    borderColor: '#11A569',
    backgroundColor: '#F4FFFB',
  },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212427',
  },
  medMemo: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  medFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medDetail: {
    fontSize: 14,
    color: '#4C4F5E',
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDone: {
    backgroundColor: '#EAF8F2',
  },
  statusWait: {
    backgroundColor: '#FFF1E3',
  },
  statusTextDone: {
    color: '#0E7C61',
    fontWeight: '700',
  },
  statusTextWait: {
    color: '#D07200',
    fontWeight: '700',
  },
  quickCard: {
    backgroundColor: '#11A569',
    borderRadius: 26,
    padding: 20,
    gap: 14,
  },
  quickLabel: {
    color: '#C7FFE6',
    fontSize: 14,
  },
  quickTimer: {
    marginTop: 4,
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
  },
  quickHint: {
    color: '#D7FFE9',
    fontSize: 13,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickPrimary: {
    backgroundColor: '#FFFFFF',
  },
  quickPrimaryText: {
    color: '#0B4C3A',
    fontWeight: '700',
  },
  quickSecondary: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  quickSecondaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    gap: 10,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1A18',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE5CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionBadgeText: {
    color: '#B2651B',
    fontWeight: '700',
  },
  instructionText: {
    flex: 1,
    fontSize: 13,
    color: '#4C4F5E',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    gap: 12,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111322',
  },
  timelineHint: {
    fontSize: 12,
    color: '#8A8F9D',
  },
  timelineItem: {
    width: 170,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E6E8F0',
    padding: 14,
  },
  timelineValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B4C3A',
  },
  timelineDesc: {
    marginTop: 6,
    fontSize: 13,
    color: '#5A6473',
  },
  timelineTime: {
    marginTop: 10,
    fontSize: 11,
    color: '#9CA3AF',
  },
});

