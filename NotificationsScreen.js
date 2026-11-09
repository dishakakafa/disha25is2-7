import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, ScrollView, StatusBar, Switch } from 'react-native';

export default function NotificationsScreen({ onBack, onNavigate, appTheme }) {
  const isDark = appTheme === 'dark';
  const [pushEnabled, setPushEnabled] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [outfitReminders, setOutfitReminders] = useState(false);

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#1A1A2E' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backIcon, isDark && { color: '#FFF' }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && { color: '#FFF' }]}>Профиль и настройки</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={[styles.settingsCard, isDark && { backgroundColor: '#2A2A40' }]}>
          <Text style={[styles.sectionTitle, isDark && { color: '#FFF' }]}>Уведомления</Text>
          
          <View style={styles.optionRow}>
            <Text style={[styles.optionText, isDark && { color: '#FFF' }]}>Пуш-уведомления</Text>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ false: "#DDF0FF", true: "#4A9BFF" }} />
          </View>
          <View style={[styles.divider, isDark && { backgroundColor: '#444' }]} />
          
          <View style={styles.optionRow}>
            <Text style={[styles.optionText, isDark && { color: '#FFF' }]}>Оповещения о погоде</Text>
            <Switch value={weatherAlerts} onValueChange={setWeatherAlerts} trackColor={{ false: "#DDF0FF", true: "#4A9BFF" }} />
          </View>
          <View style={[styles.divider, isDark && { backgroundColor: '#444' }]} />
          
          <View style={styles.optionRow}>
            <Text style={[styles.optionText, isDark && { color: '#FFF' }]}>Напоминания об образе</Text>
            <Switch value={outfitReminders} onValueChange={setOutfitReminders} trackColor={{ false: "#DDF0FF", true: "#4A9BFF" }} />
          </View>
        </View>

      </ScrollView>

      <View style={[styles.tabBar, isDark && { backgroundColor: '#2A2A40', borderTopColor: '#333' }]}>
        <TouchableOpacity style={styles.tabItem} onPress={() => onNavigate('weather')}><Text style={styles.tabIcon}>🏠</Text><Text style={styles.tabText}>Главная</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => onNavigate('rec')}><Text style={styles.tabIcon}>👕</Text><Text style={styles.tabText}>Образ</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => onNavigate('detailed')}><Text style={styles.tabIcon}>☁️</Text><Text style={styles.tabText}>Погода</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => onNavigate('favorites')}><Text style={styles.tabIcon}>❤️</Text><Text style={styles.tabText}>Избранное</Text></TouchableOpacity>
        <View style={styles.tabItem}><Text style={styles.tabIconActive}>👤</Text><Text style={styles.tabTextActive}>Профиль</Text></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DDF0FF' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center' }, backIcon: { fontSize: 40, fontWeight: '300', color: '#000', lineHeight: 40, marginTop: -5 }, headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A' },
  settingsCard: { backgroundColor: '#fff', borderRadius: 24, paddingVertical: 10, paddingHorizontal: 20, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A1A', marginTop: 10, marginBottom: 10 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  optionText: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#EFEFEF' },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15, borderTopWidth: 1, borderColor: '#EFEFEF' },
  tabItem: { alignItems: 'center' }, tabIcon: { fontSize: 20, marginBottom: 2, opacity: 0.5 }, tabIconActive: { fontSize: 20, marginBottom: 2 }, tabText: { fontSize: 11, color: '#999' }, tabTextActive: { fontSize: 11, color: '#4A9BFF', fontWeight: '700' },
});