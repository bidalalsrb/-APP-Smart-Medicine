import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

const devices = [
  { id: 'd1', name: 'number 1', status: '연결 중', battery: '85%' },
  { id: 'd2', name: 'number 2', status: '연결 대기', battery: '92%' },
  { id: 'd3', name: 'number 3', status: '연결 없음', battery: '-' },
  { id: 'd4', name: 'number 4', status: '연결 없음', battery: '-' },
  { id: 'd5', name: 'number 5', status: '연결 없음', battery: '-' },
];

const days = ['월', '화', '수', '목', '금', '토', '일'];

export default function SettingsScreen() {
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [alarmOn, setAlarmOn] = useState(true);
  const [selectedDays, setSelectedDays] = useState(['월', '수', '금']);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(40);
  const [period, setPeriod] = useState<'오전' | '오후'>('오전');

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>약 설정</Text>
          <Text style={styles.subtitle}>스마트 약통과 연동된 정보를 확인하세요.</Text>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>기기 페어링</Text>
            <Switch value={bluetoothOn} onValueChange={setBluetoothOn} />
          </View>
          <Text style={styles.panelDescription}>블루투스를 켜면 가까운 약통을 자동으로 탐색합니다.</Text>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>연결 기기 상태</Text>
            <Text style={styles.statusIndicator}>{bluetoothOn ? '연결됨' : 'OFF'}</Text>
          </View>
          {devices.map((device) => (
            <View key={device.id} style={styles.deviceRow}>
              <View>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceStatus}>{device.status}</Text>
              </View>
              <Text style={styles.deviceBattery}>{device.battery}</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>알림 설정</Text>
            <Switch value={alarmOn} onValueChange={setAlarmOn} />
          </View>
          <Text style={styles.panelDescription}>알림을 켜고 복용 시간을 설정해주세요.</Text>

          <View style={styles.timeRow}>
            <Pressable onPress={() => setPeriod(period === '오전' ? '오후' : '오전')} style={styles.periodChip}>
              <Text style={styles.periodText}>{period}</Text>
            </Pressable>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.wheelRow}>
                {Array.from({ length: 12 }, (_, index) => index + 1).map((hour) => (
                  <Pressable
                    key={hour}
                    style={[styles.wheelItem, hour === selectedHour && styles.wheelItemActive]}
                    onPress={() => setSelectedHour(hour)}>
                    <Text style={[styles.wheelText, hour === selectedHour && styles.wheelTextActive]}>{hour}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.wheelRow}>
                {Array.from({ length: 60 }, (_, index) => index).map((minute) => (
                  <Pressable
                    key={minute}
                    style={[styles.wheelItemSmall, minute === selectedMinute && styles.wheelItemActive]}
                    onPress={() => setSelectedMinute(minute)}>
                    <Text style={[styles.wheelText, minute === selectedMinute && styles.wheelTextActive]}>
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.daysRow}>
            {days.map((day) => (
              <Pressable
                key={day}
                onPress={() => toggleDay(day)}
                style={[styles.dayButton, selectedDays.includes(day) && styles.dayButtonActive]}>
                <Text style={selectedDays.includes(day) ? styles.dayTextActive : styles.dayText}>{day}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.alertPanel}>
          <Text style={styles.alertTitle}>알림 미리보기</Text>
          <Text style={styles.alertMessage}>
            “약 복용할 시간이에요!”라는 알림이 휴대폰 잠금화면에 도착합니다. 약통과 연동되어 알림을 놓치지 않아요.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F5EB',
  },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 60,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F4C3A',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7C77',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    gap: 12,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#13233F',
  },
  panelDescription: {
    fontSize: 13,
    color: '#6F7787',
  },
  statusIndicator: {
    fontSize: 12,
    color: '#0E8265',
    fontWeight: '700',
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E7EAF3',
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B273A',
  },
  deviceStatus: {
    fontSize: 12,
    color: '#6B7280',
  },
  deviceBattery: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0E8265',
  },
  timeRow: {
    gap: 12,
  },
  periodChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCF7EE',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  periodText: {
    color: '#0E8265',
    fontWeight: '700',
  },
  wheelRow: {
    flexDirection: 'row',
    gap: 8,
  },
  wheelItem: {
    width: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E6ED',
    paddingVertical: 8,
    alignItems: 'center',
  },
  wheelItemSmall: {
    width: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E6ED',
    paddingVertical: 8,
    alignItems: 'center',
  },
  wheelItemActive: {
    backgroundColor: '#F1FFFA',
    borderColor: '#0E8265',
  },
  wheelText: {
    fontSize: 16,
    color: '#7A8392',
    fontWeight: '600',
  },
  wheelTextActive: {
    color: '#0E8265',
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  dayButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E6ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#0E8265',
    borderColor: '#0E8265',
  },
  dayText: {
    fontSize: 14,
    color: '#7A8392',
    fontWeight: '600',
  },
  dayTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  alertPanel: {
    backgroundColor: '#111E36',
    borderRadius: 22,
    padding: 20,
    gap: 8,
  },
  alertTitle: {
    color: '#EEF4FF',
    fontSize: 16,
    fontWeight: '700',
  },
  alertMessage: {
    color: '#A7B7D6',
    fontSize: 13,
    lineHeight: 20,
  },
});

