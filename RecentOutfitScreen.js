import React from 'react';
import { StyleSheet, View, Image, SafeAreaView, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';

export default function RecentOutfitScreen({ onBack, onNavigate, appTheme }) {
  const isDark = appTheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#1A1A2E' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backIcon, isDark && { color: '#FFF' }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && { color: '#FFF' }]}>Недавний образ</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <View style={[styles.itemCard, isDark && { backgroundColor: '#2A2A40' }]}>
              <Image source={require('./assets/koft.png')} style={styles.itemImage} resizeMode="contain" />
            </View>
            <View style={[styles.itemCard, isDark && { backgroundColor: '#2A2A40' }]}>
              <Image source={require('./assets/shirts.png')} style={styles.itemImage} resizeMode="contain" />
            </View>
          </View>
          
          <View style={styles.plusContainer}>
            <Text style={[styles.plusText, isDark && { color: '#FFF' }]}>+</Text>
          </View>
          
          <View style={styles.gridRow}>
            <View style={[styles.itemCard, isDark && { backgroundColor: '#2A2A40' }]}>
              <Image source={require('./assets/cap.png')} style={styles.itemImage} resizeMode="contain" />
            </View>
            <View style={[styles.itemCard, isDark && { backgroundColor: '#2A2A40' }]}>
              <Image source={require('./assets/boots.png')} style={styles.itemImage} resizeMode="contain" />
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.favButton, isDark && { backgroundColor: '#2A2A40' }]}>
          <Text style={[styles.favButtonText, isDark && { color: '#FFF' }]}>Добавить образ в избранное</Text>
        </TouchableOpacity>

        <View style={[styles.tipBlock, isDark && { backgroundColor: '#2A2A40', borderColor: '#444' }]}>
          <Text style={[styles.tipText, isDark && { color: '#FFF' }]}>
            Не создавай себе проблемы{'\n'}
            с утра.{'\n'}
            Составь образ заранее!
          </Text>
          <Image source={require('./assets/hello_cat.png')} style={styles.tipCat} resizeMode="contain" />
        </View>

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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30, marginTop: 10 }, 
  backButton: { width: 40, height: 40, justifyContent: 'center' }, 
  backIcon: { fontSize: 40, fontWeight: '300', color: '#000', lineHeight: 40, marginTop: -5 }, 
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A' },
  
  gridContainer: { alignItems: 'center', marginBottom: 30 }, 
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 }, 
  itemCard: { width: '46%', aspectRatio: 1.3, backgroundColor: '#DDF0FF', borderRadius: 24, alignItems: 'center', justifyContent: 'center', padding: 15 }, 
  itemImage: { width: '100%', height: '100%' },
  
  plusContainer: { paddingVertical: 10 }, 
  plusText: { fontSize: 40, fontWeight: '900', color: '#000', lineHeight: 40 },
  
  favButton: { backgroundColor: '#DDF0FF', borderRadius: 20, paddingVertical: 16, alignItems: 'center', marginBottom: 30 }, 
  favButtonText: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  
  tipBlock: { position: 'relative', backgroundColor: '#fff', borderRadius: 24, borderWidth: 1, borderColor: '#000', padding: 20, minHeight: 180, justifyContent: 'center' }, 
  tipText: { fontSize: 18, fontWeight: '900', color: '#1A1A1A', lineHeight: 26, textAlign: 'center', zIndex: 2, marginBottom: 20 }, 
  tipCat: { position: 'absolute', right: -10, bottom: -20, width: 140, height: 140, zIndex: 1 },
  
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15, borderTopWidth: 1, borderColor: '#EFEFEF' }, 
  tabItem: { alignItems: 'center' }, 
  tabIcon: { fontSize: 20, marginBottom: 2, opacity: 0.5 }, 
  tabIconActive: { fontSize: 20, marginBottom: 2 }, 
  tabText: { fontSize: 11, color: '#999' }, 
  tabTextActive: { fontSize: 11, color: '#4A9BFF', fontWeight: '700' },
});