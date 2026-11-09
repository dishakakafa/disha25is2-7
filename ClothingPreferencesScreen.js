import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';

export default function ClothingPreferencesScreen({ onBack, onNavigate, appTheme }) {
  const isDark = appTheme === 'dark';
  const [selectedStyles, setSelectedStyles] = useState(['Casual']);

  const toggleStyle = (style) => {
    if (selectedStyles.includes(style)) setSelectedStyles(selectedStyles.filter(s => s !== style));
    else setSelectedStyles([...selectedStyles, style]);
  };

  const stylesList = ['Casual', 'Спортивный', 'Классический', 'Уличный', 'Романтический', 'Деловой'];

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
          <Text style={[styles.sectionTitle, isDark && { color: '#FFF' }]}>Ваш стиль в одежде</Text>
          <Text style={[styles.description, isDark && { color: '#AAA' }]}>Выберите стили, которые вам нравятся. Мы будем учитывать это в рекомендациях.</Text>
          
          <View style={styles.stylesGrid}>
            {stylesList.map((style) => {
              const isSelected = selectedStyles.includes(style);
              return (
                <TouchableOpacity 
                  key={style} 
                  style={[styles.styleBtn, isDark && { backgroundColor: '#1A1A2E' }, isSelected && styles.styleBtnActive, isDark && isSelected && { backgroundColor: '#4A9BFF', borderColor: '#4A9BFF' }]}
                  onPress={() => toggleStyle(style)}
                >
                  <Text style={[styles.styleBtnText, isDark && { color: '#FFF' }, isSelected && styles.styleBtnTextActive]}>{style}</Text>
                  {isSelected && <Text style={styles.checkIcon}>✅</Text>}
                </TouchableOpacity>
              );
            })}
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
  settingsCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A1A', marginBottom: 8 },
  description: { fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 },
  stylesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  styleBtn: { width: '48%', backgroundColor: '#F0F5FA', borderRadius: 12, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  styleBtnActive: { backgroundColor: '#DDF0FF', borderWidth: 1, borderColor: '#4A9BFF' },
  styleBtnText: { fontSize: 14, fontWeight: '700', color: '#333' },
  styleBtnTextActive: { color: '#4A9BFF' },
  checkIcon: { fontSize: 14 },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15, borderTopWidth: 1, borderColor: '#EFEFEF' },
  tabItem: { alignItems: 'center' }, tabIcon: { fontSize: 20, marginBottom: 2, opacity: 0.5 }, tabIconActive: { fontSize: 20, marginBottom: 2 }, tabText: { fontSize: 11, color: '#999' }, tabTextActive: { fontSize: 11, color: '#4A9BFF', fontWeight: '700' },
});