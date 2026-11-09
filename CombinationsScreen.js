import React, { useState } from 'react';
import { StyleSheet, View, Image, SafeAreaView, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';

export default function CombinationsScreen({ onBack, onNavigate, appTheme }) {
  const [isHeart1Active, setIsHeart1Active] = useState(true);
  const [isHeart2Active, setIsHeart2Active] = useState(true);
  const isDark = appTheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#1A1A2E' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backIcon, isDark && { color: '#FFF' }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && { color: '#FFF' }]}>Избранное</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.inactiveTab, isDark && { backgroundColor: '#2A2A40' }]} onPress={() => onNavigate('favorites')}>
            <Text style={[styles.inactiveTabText, isDark && { color: '#FFF' }]}>Образы</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>Сочетания</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, isDark && { backgroundColor: '#2A2A40' }]}>
          <View style={styles.cardGridLarge}>
            <Image source={require('./assets/T_shirt.png')} style={styles.gridImageLarge} resizeMode="contain" />
            <Image source={require('./assets/favorite_img2.png')} style={styles.gridImageLarge} resizeMode="contain" />
          </View>
          <TouchableOpacity style={[styles.heartButton, isDark && { backgroundColor: '#444' }]} onPress={() => setIsHeart1Active(!isHeart1Active)}>
            <Text style={styles.heartIcon}>{isHeart1Active ? '❤️' : '🖤'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, isDark && { backgroundColor: '#2A2A40' }]}>
          <View style={styles.cardGridLarge}>
            <Image source={require('./assets/palto.png')} style={styles.gridImageLarge} resizeMode="contain" />
            <Image source={require('./assets/cups.png')} style={styles.gridImageLarge} resizeMode="contain" />
          </View>
          <TouchableOpacity style={[styles.heartButton, isDark && { backgroundColor: '#444' }]} onPress={() => setIsHeart2Active(!isHeart2Active)}>
            <Text style={styles.heartIcon}>{isHeart2Active ? '❤️' : '🖤'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.bottomBanner, isDark && { backgroundColor: '#2A2A40' }]}>
          <Image source={require('./assets/funny_cat.png')} style={styles.bannerCat} resizeMode="contain" />
          <View style={styles.bannerTextContainer}>
            <Text style={[styles.bannerText, isDark && { color: '#FFF' }]}>Твой любимый образ{'\n'}на любой случай!</Text>
          </View>
        </View>

      </ScrollView>

      <View style={[styles.tabBar, isDark && { backgroundColor: '#2A2A40', borderTopColor: '#333' }]}>
        <TouchableOpacity style={styles.tabItem} onPress={() => onNavigate('weather')}><Text style={styles.tabIcon}>🏠</Text><Text style={styles.tabText}>Главная</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => onNavigate('rec')}><Text style={styles.tabIcon}>👕</Text><Text style={styles.tabText}>Образ</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => onNavigate('detailed')}><Text style={styles.tabIcon}>☁️</Text><Text style={styles.tabText}>Погода</Text></TouchableOpacity>
        <View style={styles.tabItem}><Text style={styles.tabIconActive}>❤️</Text><Text style={styles.tabTextActive}>Избранное</Text></View>
        <TouchableOpacity style={styles.tabItem} onPress={() => onNavigate('profile')}><Text style={styles.tabIcon}>👤</Text><Text style={styles.tabText}>Профиль</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DDF0FF' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center' }, 
  backIcon: { fontSize: 40, fontWeight: '300', color: '#000', lineHeight: 40, marginTop: -5 }, 
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A' },
  
  tabsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  activeTab: { backgroundColor: '#4A9BFF', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 25, marginLeft: 15 },
  activeTabText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  inactiveTab: { backgroundColor: '#fff', borderRadius: 30, paddingVertical: 10, paddingHorizontal: 25 },
  inactiveTabText: { color: '#1A1A1A', fontWeight: '800', fontSize: 15 },

  card: { backgroundColor: '#fff', borderRadius: 24, padding: 15, marginBottom: 15, position: 'relative', elevation: 3 },
  cardGridLarge: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10 },
  gridImageLarge: { width: '45%', height: 140 },
  
  heartButton: { position: 'absolute', top: 15, right: 15, width: 36, height: 36, backgroundColor: '#fff', borderRadius: 18, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  heartIcon: { fontSize: 18 },

  bottomBanner: { backgroundColor: '#fff', borderRadius: 24, padding: 15, flexDirection: 'row', alignItems: 'center', marginTop: 10, elevation: 3 },
  bannerCat: { width: 60, height: 60, marginRight: 15 },
  bannerTextContainer: { flex: 1 },
  bannerText: { fontSize: 16, fontWeight: '900', color: '#1A1A1A', lineHeight: 22 },

  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15, borderTopWidth: 1, borderColor: '#EFEFEF' },
  tabItem: { alignItems: 'center' }, 
  tabIcon: { fontSize: 20, marginBottom: 2, opacity: 0.5 }, 
  tabIconActive: { fontSize: 20, marginBottom: 2 }, 
  tabText: { fontSize: 11, color: '#999' }, 
  tabTextActive: { fontSize: 11, color: '#4A9BFF', fontWeight: '700' },
});