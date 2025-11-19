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

type RecordCard = {
  id: string;
  title: string;
  minutes: number;
  timestamp: string;
};

const initialRecords: RecordCard[] = [
  { id: 'rec-1', title: '3시간 47분', minutes: 227, timestamp: '2023.10.04 오후 8:10 기록' },
  { id: 'rec-2', title: '0시간 15분', minutes: 15, timestamp: '2023.10.05 오전 8:02 기록' },
  { id: 'rec-3', title: '30시간 20분', minutes: 1820, timestamp: '2023.10.06 오후 11:00 기록' },
];

export default function MedicationSession() {
  const router = useRouter();
  const [records, setRecords] = useState(initialRecords);
  const [sessionState, setSessionState] = useState<'idle' | 'logged'>('idle');

  const nextDose = useMemo(
    () => ({
      title: '약 복용 예정 시간',
      date: '2023년 10월 4일 목요일 오후 8:00',
      message: '정해진 시간에 맞춰 복용을 기록해 주세요.',
    }),
    []
  );

  const handleLogDose = () => {
    const now = new Date();
    const timeLabel = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(
      now.getDate()
    ).padStart(2, '0')} ${now.getHours() >= 12 ? '오후' : '오전'} ${String(
      now.getHours() > 12 ? now.getHours() - 12 : now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 기록`;

    const newRecord: RecordCard = {
      id: `rec-${Date.now()}`,
      minutes: 5,
      title: '0시간 05분',
      timestamp: timeLabel,
    };
    setRecords((previous) => [newRecord, ...previous].slice(0, 5));
    setSessionState('logged');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>복용 확인</Text>
            <Text style={styles.headerDate}>{nextDose.date}</Text>
          </View>
          <Pressable style={styles.addButton} onPress={() => router.push('/add-medicine')}>
            <Text style={styles.addButtonText}>+ 약 등록</Text>
          </Pressable>
        </View>

        <View style={styles.sessionCard}>
          <Text style={styles.sessionQuestion}>이번 복용은 어땠나요?</Text>
          <Text style={styles.sessionMessage}>{nextDose.message}</Text>

          <View style={styles.sessionTimer}>
            <Text style={styles.sessionTimerLabel}>다음 알림까지</Text>
            <Text style={styles.sessionTimerValue}>11시간 30분</Text>
            <Text style={styles.sessionTimerSub}>휴대폰의 알림과 함께 복용해 보세요.</Text>
          </View>

          <Pressable
            style={[styles.logButton, sessionState === 'logged' && styles.logButtonCompleted]}
            onPress={handleLogDose}>
            <Text
              style={sessionState === 'logged' ? styles.logButtonTextCompleted : styles.logButtonText}>
              {sessionState === 'logged' ? '기록 완료' : '복용했어요'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.sliderHeader}>
          <Text style={styles.sliderTitle}>최근 측정</Text>
          <Text style={styles.sliderSubtitle}>좌우로 슬라이드하여 확인</Text>
        </View>

        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={{ gap: 16 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={[styles.recordCard, index === 0 && styles.recordHighlight]}>
              <Text style={[styles.recordTitle, index === 0 && styles.recordTitleHighlight]}>
                {item.title}
              </Text>
              <Text style={styles.recordSubtitle}>복용 완료</Text>
              <Text style={styles.recordTimestamp}>{item.timestamp}</Text>
            </View>
          )}
        />

        <View style={styles.tipCard}>
          <View>
            <Text style={styles.tipTitle}>복용 노트</Text>
            <Text style={styles.tipSubtitle}>복용 시 느낀 점을 기록해 두면 다음 진료 때 도움이 돼요.</Text>
          </View>
          <Pressable style={styles.tipButton} onPress={() => router.push('/add-medicine')}>
            <Text style={styles.tipButtonText}>노트 작성</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E9F7F2',
  },
  content: {
    padding: 20,
    gap: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0C4C38',
  },
  headerDate: {
    marginTop: 4,
    fontSize: 13,
    color: '#428879',
  },
  addButton: {
    backgroundColor: '#0C4C38',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  sessionCard: {
    backgroundColor: '#11A569',
    borderRadius: 28,
    padding: 24,
    gap: 18,
  },
  sessionQuestion: {
    fontSize: 18,
    color: '#D9F8EB',
    fontWeight: '600',
  },
  sessionMessage: {
    fontSize: 14,
    color: '#E5FFFA',
    lineHeight: 20,
  },
  sessionTimer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 22,
    padding: 20,
  },
  sessionTimerLabel: {
    color: '#E5FFFA',
    fontSize: 12,
    letterSpacing: 1,
  },
  sessionTimerValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 6,
  },
  sessionTimerSub: {
    color: '#E5FFFA',
    marginTop: 4,
    fontSize: 13,
  },
  logButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  logButtonCompleted: {
    backgroundColor: '#0B4634',
  },
  logButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B4634',
  },
  logButtonTextCompleted: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0C4C38',
  },
  sliderSubtitle: {
    fontSize: 12,
    color: '#6E9C8F',
  },
  recordCard: {
    width: 180,
    borderRadius: 22,
    padding: 18,
    backgroundColor: '#FFFFFF',
  },
  recordHighlight: {
    backgroundColor: '#DFF8EE',
    borderWidth: 1,
    borderColor: '#4FB892',
  },
  recordTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0C4C38',
  },
  recordTitleHighlight: {
    color: '#167F5B',
  },
  recordSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#6E9C8F',
  },
  recordTimestamp: {
    marginTop: 10,
    fontSize: 12,
    color: '#90A79E',
  },
  tipCard: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0C4C38',
  },
  tipSubtitle: {
    fontSize: 13,
    color: '#6E9C8F',
    marginTop: 4,
    width: 200,
  },
  tipButton: {
    backgroundColor: '#0C4C38',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  tipButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

