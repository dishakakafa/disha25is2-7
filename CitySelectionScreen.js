import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, ScrollView, StatusBar, TextInput } from 'react-native';

export default function CitySelectionScreen({ onBack, onNavigate, setSelectedCity, redirectTo, appTheme }) {
  const isDark = appTheme === 'dark';
  const allCities = ['Москва', 'Санкт-Петербург', 'Казань', 'Сочи', 'Екатеринбург', 'Калининград', 'Грозный', 'Краснодар', 'Нижний Новгород', 'Тюмень', 'Новосибирск', 'Самара', 'Омск'];
  const [searchText, setSearchText] = useState('');
  const [currentCity, setCurrentCity] = useState('Москва');
  
  const filteredCities = allCities.filter(city => city.toLowerCase().includes(searchText.toLowerCase()));

  const handleSelectCity = (city) => {
    setCurrentCity(city);       
    setSelectedCity(city);      
    setTimeout(() => {
      if (redirectTo === 'weather') onNavigate('weather');
      else onBack(); 
    }, 200);                    
  };

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#1A1A2E' }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backIcon, isDark && { color: '#FFF' }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && { color: '#FFF' }]}>Профиль и настройки</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={[styles.cityCard, isDark && { backgroundColor: '#2A2A40' }]}>
          <View style={[styles.searchContainer, isDark && { backgroundColor: '#1A1A2E' }]}>
            <TextInput 
              style={[styles.searchInput, isDark && { color: '#FFF' }]} 
              placeholder="Поиск..." 
              placeholderTextColor={isDark ? '#888' : '#999'} 
              value={searchText}
              onChangeText={setSearchText}
            />
            <Text style={styles.searchIcon}>🔍</Text>
          </View>

          <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <View key={index}>
                  <TouchableOpacity style={styles.cityRow} onPress={() => handleSelectCity(city)}>
                    <Text style={[styles.cityText, isDark && { color: '#FFF' }]}>{city}</Text>
                    {currentCity === city && <Text style={styles.checkIcon}>✅</Text>}
                  </TouchableOpacity>
                  {index !== filteredCities.length - 1 && <View style={[styles.divider, isDark && { backgroundColor: '#444' }]} />}
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Город не найден</Text>
            )}
          </ScrollView>
        </View>
      </View>

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
  scrollContent: { flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center' }, backIcon: { fontSize: 40, fontWeight: '300', color: '#000', lineHeight: 40, marginTop: -5 }, headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A' },
  cityCard: { backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', elevation: 3, flex: 1 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DDF0FF', margin: 15, borderRadius: 12, paddingHorizontal: 15, height: 45 },
  searchInput: { flex: 1, fontSize: 16, color: '#333', height: '100%' }, searchIcon: { fontSize: 18 },
  cityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20 },
  cityText: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' }, checkIcon: { fontSize: 18 },
  divider: { height: 1, backgroundColor: '#EFEFEF', marginHorizontal: 20 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999', fontSize: 16 },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15, borderTopWidth: 1, borderColor: '#EFEFEF' },
  tabItem: { alignItems: 'center' }, tabIcon: { fontSize: 20, marginBottom: 2, opacity: 0.5 }, tabIconActive: { fontSize: 20, marginBottom: 2 }, tabText: { fontSize: 11, color: '#999' }, tabTextActive: { fontSize: 11, color: '#4A9BFF', fontWeight: '700' },
});