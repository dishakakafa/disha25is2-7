import React, { useState } from 'react';
import { StyleSheet, View, Image, SafeAreaView, Text, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import AboutModal from './AboutModal';
import { supabase } from './supabase'; // <-- Импорт Supabase

export default function ProfileScreen({ onBack, onNavigate, selectedCity, tempUnit, appTheme, userName, userEmail, userAvatar }) { 
  const isDark = appTheme === 'dark';
  const [isAboutVisible, setIsAboutVisible] = useState(false);

  // Функция выхода из аккаунта
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Ошибка', error.message);
    }
  };

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

        <TouchableOpacity 
          style={[styles.userCard, isDark && { backgroundColor: '#2A2A40' }]} 
          onPress={() => onNavigate('profile_settings')}
          activeOpacity={0.8}
        >
          <View style={[styles.avatarContainer, isDark && { backgroundColor: '#1A1A2E' }]}>
            <Image 
              source={userAvatar ? { uri: userAvatar } : require('./assets/hello_cat.png')} 
              style={styles.avatarImage} 
              resizeMode="cover" 
            />
          </View>
          <View>
            <Text style={[styles.userName, isDark && { color: '#FFF' }]}>{userName}</Text>
            <Text style={[styles.userEmail, isDark && { color: '#AAA' }]}>{userEmail}</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.menuBlock, isDark && { backgroundColor: '#2A2A40' }]}>
          
          <TouchableOpacity style={[styles.menuItem, isDark && { backgroundColor: '#2A2A40' }]} onPress={() => onNavigate('city_selection')}>
            <View style={styles.menuLeft}><Text style={styles.menuIcon}>🗺️</Text><Text style={[styles.menuText, isDark && { color: '#FFF' }]}>Мой город</Text></View>
            <View style={styles.menuRight}><Text style={[styles.menuValue, isDark && { color: '#AAA' }]}>{selectedCity}</Text><Text style={styles.arrow}>»</Text></View>
          </TouchableOpacity>
          <View style={[styles.divider, isDark && { backgroundColor: '#444' }]} />

          <TouchableOpacity style={[styles.menuItem, isDark && { backgroundColor: '#2A2A40' }]} onPress={() => onNavigate('temperature_settings')}>
            <View style={styles.menuLeft}><Text style={styles.menuIcon}>🌡️</Text><Text style={[styles.menuText, isDark && { color: '#FFF' }]}>Единицы температуры</Text></View>
            <View style={styles.menuRight}><Text style={[styles.menuValue, isDark && { color: '#AAA' }]}>°{tempUnit}</Text><Text style={styles.arrow}>»</Text></View>
          </TouchableOpacity>
          <View style={[styles.divider, isDark && { backgroundColor: '#444' }]} />

          <TouchableOpacity style={[styles.menuItem, isDark && { backgroundColor: '#2A2A40' }]} onPress={() => onNavigate('clothing_preferences')}>
            <View style={styles.menuLeft}><Text style={styles.menuIcon}>👖</Text><Text style={[styles.menuText, isDark && { color: '#FFF' }]}>Предпочтения в одежде</Text></View>
            <View style={styles.menuRight}><Text style={styles.arrow}>»</Text></View>
          </TouchableOpacity>
          <View style={[styles.divider, isDark && { backgroundColor: '#444' }]} />

          <TouchableOpacity style={[styles.menuItem, isDark && { backgroundColor: '#2A2A40' }]} onPress={() => onNavigate('notifications')}>
            <View style={styles.menuLeft}><Text style={styles.menuIcon}>📱</Text><Text style={[styles.menuText, isDark && { color: '#FFF' }]}>Уведомления</Text></View>
            <View style={styles.menuRight}><Text style={styles.arrow}>»</Text></View>
          </TouchableOpacity>
          <View style={[styles.divider, isDark && { backgroundColor: '#444' }]} />

          <TouchableOpacity style={[styles.menuItem, isDark && { backgroundColor: '#2A2A40' }]} onPress={() => onNavigate('theme_settings')}>
            <View style={styles.menuLeft}><Text style={styles.menuIcon}>🌙</Text><Text style={[styles.menuText, isDark && { color: '#FFF' }]}>Тема</Text></View>
            <View style={styles.menuRight}>
              <Text style={[styles.menuValue, isDark && { color: '#AAA' }]}>{isDark ? 'Тёмная' : 'Светлая'}</Text>
              <Text style={styles.arrow}>»</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.divider, isDark && { backgroundColor: '#444' }]} />

          <TouchableOpacity style={[styles.menuItem, isDark && { backgroundColor: '#2A2A40' }]} onPress={() => setIsAboutVisible(true)}>
            <View style={styles.menuLeft}><Text style={styles.menuIcon}>ℹ️</Text><Text style={[styles.menuText, isDark && { color: '#FFF' }]}>О приложении</Text></View>
            <View style={styles.menuRight}><Text style={styles.arrow}>»</Text></View>
          </TouchableOpacity>
          
          {/* КНОПКА ВЫХОДА ИЗ АККАУНТА */}
          <View style={[styles.divider, isDark && { backgroundColor: '#444' }]} />
          <TouchableOpacity style={[styles.menuItem, isDark && { backgroundColor: '#2A2A40' }]} onPress={handleSignOut}>
            <View style={styles.menuLeft}><Text style={styles.menuIcon}>🚪</Text><Text style={[styles.menuText, { color: '#FF4C4C' }]}>Выйти из аккаунта</Text></View>
            <View style={styles.menuRight}><Text style={styles.arrow}>»</Text></View>
          </TouchableOpacity>

        </View>
      </ScrollView>

      <AboutModal 
        visible={isAboutVisible} 
        onClose={() => setIsAboutVisible(false)} 
        appTheme={appTheme} 
      />

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
  userCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 20, elevation: 3 }, 
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#DDF0FF', overflow: 'hidden', marginRight: 15, justifyContent: 'center', alignItems: 'center' }, avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' }, userName: { fontSize: 22, fontWeight: '900', color: '#1A1A1A', marginBottom: 4 }, userEmail: { fontSize: 14, color: '#888', fontWeight: '500' },
  menuBlock: { backgroundColor: '#fff', borderRadius: 24, paddingVertical: 10, paddingHorizontal: 15, elevation: 3 }, 
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderRadius: 12, paddingHorizontal: 10, marginHorizontal: -10 }, 
  menuLeft: { flexDirection: 'row', alignItems: 'center' }, menuIcon: { fontSize: 20, marginRight: 15 }, menuText: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' }, 
  menuRight: { flexDirection: 'row', alignItems: 'center' }, menuValue: { fontSize: 14, color: '#999', fontWeight: '600', marginRight: 10 }, arrow: { fontSize: 24, color: '#ccc', fontWeight: '300', marginTop: -2 }, 
  divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 35 },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15, borderTopWidth: 1, borderColor: '#EFEFEF' }, 
  tabItem: { alignItems: 'center' }, tabIcon: { fontSize: 20, marginBottom: 2, opacity: 0.5 }, tabIconActive: { fontSize: 20, marginBottom: 2 }, tabText: { fontSize: 11, color: '#999' }, tabTextActive: { fontSize: 11, color: '#4A9BFF', fontWeight: '700' },
});