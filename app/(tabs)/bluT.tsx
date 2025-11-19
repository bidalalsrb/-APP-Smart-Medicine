import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  const [manager, setManager] = useState<BleManager | null>(null);

  const [devices, setDevices] = useState<any[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);

  const [receivedData, setReceivedData] = useState<string>("");
  const [sendValue, setSendValue] = useState<string>("");

  const [serviceUUID, setServiceUUID] = useState("service-uuid-here");
  const [charUUID, setCharUUID] = useState("char-uuid-here");
  const [writeUUID, setWriteUUID] = useState("write-uuid-here");

  // ⭐ 화면 로그 관리
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => {
      const newLogs = [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev];
      return newLogs.slice(0, 200); // 메모리 보호
    });
  };

  useEffect(() => {
    const m = new BleManager();
    setManager(m);

    addLog("BLE Manager 초기화 완료");

    return () => {
      addLog("BLE Manager destroy()");
      m.destroy();
    };
  }, []);

  if (!manager) {
    return (
      <ThemedView style={{ padding: 20 }}>
        <ThemedText>BLE 초기화 중...</ThemedText>
      </ThemedView>
    );
  }

  // =================================================
  // 스캔
  // =================================================
  const startScan = () => {
    setDevices([]);
    addLog("🔍 스캔 시작");

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        addLog(`❌ Scan error: ${error.message}`);
        return;
      }

      if (device && device.name) {
        addLog(`📡 발견됨 → ${device.name} (${device.id})`);

        setDevices(prev => {
          if (prev.find(d => d.id === device.id)) return prev;
          return [...prev, device];
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      addLog("⏹ 스캔 자동 종료 (10초)");
    }, 10000);
  };

  // =================================================
  // 연결
  // =================================================
  const connectDevice = async (device: any) => {
    try {
      addLog(`⏳ 연결 시도 → ${device.name}`);
      manager.stopDeviceScan();

      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();

      setConnectedDevice(connected);
      addLog(`🔵 연결됨 → ${device.name}`);

      // notify listener
      connected.monitorCharacteristicForService(
        serviceUUID,
        charUUID,
        (error, characteristic) => {
          if (error) {
            addLog(`❌ Notify error: ${error.message}`);
            return;
          }

          if (characteristic?.value) {
            const decoded = Buffer.from(characteristic.value, "base64").toString("utf8");
            setReceivedData(decoded);
            addLog(`📩 Notify 수신 → ${decoded}`);
          }
        }
      );

    } catch (e: any) {
      addLog(`❌ 연결 실패: ${e.message}`);
    }
  };

  // =================================================
  // 데이터 전송
  // =================================================
  const sendData = async () => {
    if (!connectedDevice) return;

    try {
      const base64Value = Buffer.from(sendValue, "utf8").toString("base64");

      await connectedDevice.writeCharacteristicWithResponseForService(
        serviceUUID,
        writeUUID,
        base64Value
      );

      addLog(`📤 전송 → ${sendValue}`);
      setSendValue("");

    } catch (e: any) {
      addLog(`❌ 전송 실패: ${e.message}`);
    }
  };

  // =================================================
  // 해제
  // =================================================
  const disconnect = () => {
    if (connectedDevice) {
      addLog(`⛔ 연결 해제 → ${connectedDevice.name}`);
      connectedDevice.cancelConnection();
      setConnectedDevice(null);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          BLE Manager (Toss Style)
        </ThemedText>
      </ThemedView>

      {/* =================== UUID 카드 =================== */}
      <View style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>🔧 UUID 설정</ThemedText>

        <TextInput style={styles.input} value={serviceUUID} onChangeText={setServiceUUID} placeholder="Service UUID" />
        <TextInput style={styles.input} value={charUUID} onChangeText={setCharUUID} placeholder="Characteristic UUID (notify/read)" />
        <TextInput style={styles.input} value={writeUUID} onChangeText={setWriteUUID} placeholder="Write UUID" />
      </View>

      {/* =================== 스캔 카드 =================== */}
      <View style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>🔍 장치 검색</ThemedText>

        <TouchableOpacity style={styles.primaryBtn} onPress={startScan}>
          <ThemedText style={styles.primaryBtnText}>BLE 장치 스캔</ThemedText>
        </TouchableOpacity>

        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          style={{ marginTop: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.deviceBtn} onPress={() => connectDevice(item)}>
              <ThemedText>{item.name}</ThemedText>
              <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>{item.id}</ThemedText>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* =================== 연결 상태 =================== */}
      <View style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>🔵 연결 상태</ThemedText>

        <ThemedText>
          {connectedDevice ? `✔ 연결됨 (${connectedDevice.name})` : "❌ 연결 안됨"}
        </ThemedText>

        {connectedDevice && (
          <TouchableOpacity style={styles.redBtn} onPress={disconnect}>
            <ThemedText style={styles.redBtnText}>연결 해제</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* =================== 데이터 송수신 =================== */}
      <View style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>📩 받은 데이터</ThemedText>
        <ThemedText>{receivedData || "수신 데이터 없음"}</ThemedText>

        <ThemedText type="subtitle" style={[styles.cardTitle, { marginTop: 15 }]}>📤 데이터 전송</ThemedText>

        <TextInput
          value={sendValue}
          onChangeText={setSendValue}
          placeholder="보낼 값 입력"
          style={styles.input}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={sendData}>
          <ThemedText style={styles.primaryBtnText}>전송</ThemedText>
        </TouchableOpacity>
      </View>

      {/* =================== 📜 화면 로그 =================== */}
      <View style={styles.logCard}>
        <ThemedText style={styles.logTitle}>📜 실시간 LOG</ThemedText>

        <ScrollView style={{ maxHeight: 250 }}>
          {logs.map((line, idx) => (
            <ThemedText key={idx} style={styles.logLine}>
              {line}
            </ThemedText>
          ))}
        </ScrollView>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },

  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },

  primaryBtn: {
    backgroundColor: '#2f80ff',
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 2,
  },

  primaryBtnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },

  deviceBtn: {
    backgroundColor: '#f7f8fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderColor: '#eee',
    borderWidth: 1,
  },

  redBtn: {
    marginTop: 14,
    paddingVertical: 12,
    backgroundColor: '#ff4d4f',
    borderRadius: 14,
  },

  redBtnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },

  /* ---- 로그 카드 ---- */
  logCard: {
    backgroundColor: '#1b1d20',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 14,
    marginBottom: 40,
  },

  logTitle: {
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 8,
  },

  logLine: {
    color: '#c8c8c8',
    fontSize: 13,
    marginBottom: 4,
  },
});
