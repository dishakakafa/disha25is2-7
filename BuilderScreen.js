import React from 'react';
import { StyleSheet, View, Image, SafeAreaView, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';

export default function BuilderScreen({ onBack, onNavigate, appTheme }) {
  const isDark = appTheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#1A1A2E' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backIcon, isDark && { color: '#FFF' }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && { color: '#FFF' }]}>Собери образ</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.mainLayout}>
          <View style={[styles.sidebar, isDark && { backgroundColor: '#2A2A40' }]}>
            <View style={styles.categoryBtn}><Image source={require('./assets/hoodi.png')} style={styles.categoryImg} resizeMode="contain" /><Text style={[styles.categoryText, isDark && { color: '#FFF' }]}>Верх</Text></View>
            <View style={styles.categoryBtn}><Image source={require('./assets/shirts.png')} style={styles.categoryImg} resizeMode="contain" /><Text style={[styles.categoryText, isDark && { color: '#FFF' }]}>Низ</Text></View>
            <View style={styles.categoryBtn}><Image source={require('./assets/boots.png')} style={styles.categoryImg} resizeMode="contain" /><Text style={[styles.categoryText, isDark && { color: '#FFF' }]}>Обувь</Text></View>
            <View style={styles.categoryBtn}><Image source={require('./assets/jacket.png')} style={styles.categoryImg} resizeMode="contain" /><Text style={[styles.categoryText, isDark && { color: '#FFF' }]}>Верхняя{'\n'}одежда</Text></View>
          </View>
          
          {/* КЛИКАБЕЛЬНАЯ ТАБЛИЧКА */}
          <TouchableOpacity style={[styles.canvasArea, isDark && { backgroundColor: '#2A2A40' }]} onPress={() => onNavigate('recent_outfit')}>
            <Text style={styles.canvasTitle}>Недавний образ</Text>
            <View style={styles.outfitCanvas}>
              <Image source={require('./assets/cap.png')} style={{ position: 'absolute', top: -10, left: -20, width: 90, height: 90 }} resizeMode="contain" />
              <Image source={require('./assets/koft.png')} style={{ position: 'absolute', top: 20, alignSelf: 'center', width: 120, height: 120 }} resizeMode="contain" />
              <View style={styles.selectedItem}>
                <Image source={require('./assets/shirts.png')} style={{ width: 170, height: 150, top: 10, left: -5 }} resizeMode="contain" />
              </View>
              <Image source={require('./assets/boots.png')} style={{ position: 'absolute', bottom: 10, right: -20, width: 100, height: 100, top: 235 }} resizeMode="contain" />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.weatherBlock, isDark && { backgroundColor: '#2A2A40' }]}>
          <View style={styles.weatherHeader}>
            <Text style={[styles.weatherTitle, isDark && { color: '#FFF' }]}>Подойдёт для такой погоды</Text>
            <Image source={require('./assets/check.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
          </View>
          <View style={styles.weatherDetails}>
            <View style={styles.weatherCol}><Text style={styles.weatherLabel}>Осадки</Text><Text style={[styles.weatherValue, isDark && { color: '#FFF' }]}>0%</Text></View>
            <View style={styles.weatherCol}><Text style={styles.weatherLabel}>Ветер</Text><Text style={[styles.weatherValue, isDark && { color: '#FFF' }]}>3 м/с</Text></View>
            <View style={styles.weatherCol}><Text style={styles.weatherLabel}>Влажность</Text><Text style={[styles.weatherValue, isDark && { color: '#FFF' }]}>45%</Text></View>
          </View>
        </View>
        
        <Image source={require('./assets/hello_cat.png')} style={{ position: 'absolute', bottom: 10, right: 150, width: 250, height: 250, top: 550 }} resizeMode="contain" />
      </ScrollView>
      
      <View style={[styles.tabBar, isDark && { backgroundColor: '#2A2A40', borderTopColor: '#333' }]}>
        <TouchableOpacity style={styles.tabItem} onPress={() => onNavigate('weather')}><Text style={styles.tabIcon}>🏠</Text><Text style={styles.tabText}>Главная</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => onNavigate('rec')}><Text style={styles.tabIconActive}>👕</Text><Text style={styles.tabTextActive}>Образ</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => onNavigate('detailed')}><Text style={styles.tabIcon}>☁️</Text><Text style={styles.tabText}>Погода</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => onNavigate('favorites')}><Text style={styles.tabIcon}>❤️</Text><Text style={styles.tabText}>Избранное</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => onNavigate('profile')}><Text style={styles.tabIcon}>👤</Text><Text style={styles.tabText}>Профиль</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' }, 
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 }, 
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 }, 
  backButton: { width: 40, height: 40, justifyContent: 'center' }, 
  backIcon: { fontSize: 40, fontWeight: '300', color: '#000', lineHeight: 40, marginTop: -5 }, 
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A' },
  
  mainLayout: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }, 
  sidebar: { width: '28%', backgroundColor: '#DDF0FF', borderRadius: 24, paddingVertical: 15, alignItems: 'center' }, 
  categoryBtn: { alignItems: 'center', marginBottom: 15, width: '100%' }, 
  categoryImg: { width: 50, height: 50, marginBottom: 2 }, 
  categoryText: { fontSize: 11, fontWeight: '800', color: '#1A1A1A', textAlign: 'center' },
  
  canvasArea: { width: '68%', backgroundColor: '#DDF0FF', borderRadius: 24, padding: 15, minHeight: 350 }, 
  canvasTitle: { fontSize: 14, fontWeight: '800', color: '#999', textAlign: 'center', marginBottom: 10 }, 
  outfitCanvas: { flex: 1, position: 'relative', width: '100%', height: 280 }, 
  selectedItem: { position: 'absolute', top: 130, alignSelf: 'center', alignItems: 'center' },
  
  weatherBlock: { backgroundColor: '#DDF0FF', borderRadius: 24, padding: 20, marginBottom: 20 }, 
  weatherHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }, 
  weatherTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' }, 
  weatherDetails: { flexDirection: 'row', justifyContent: 'space-between' }, 
  weatherCol: { alignItems: 'center' }, 
  weatherLabel: { fontSize: 14, fontWeight: '800', color: '#666', marginBottom: 4 }, 
  weatherValue: { fontSize: 16, fontWeight: '900', color: '#1A1A1A' }, 
  builderCat: { width: 180, height: 180, alignSelf: 'flex-start', marginLeft: 10, marginTop: -10 },
  
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15, borderTopWidth: 1, borderColor: '#EFEFEF' }, 
  tabItem: { alignItems: 'center' }, 
  tabIcon: { fontSize: 20, marginBottom: 2, opacity: 0.5 }, 
  tabIconActive: { fontSize: 20, marginBottom: 2 }, 
  tabText: { fontSize: 11, color: '#999' }, 
  tabTextActive: { fontSize: 11, color: '#4A9BFF', fontWeight: '700' },
});