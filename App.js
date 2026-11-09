import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Image, SafeAreaView, Text, Animated, TouchableOpacity, ScrollView, Dimensions, StatusBar, Alert } from 'react-native';
import { Asset } from 'expo-asset';
import * as Linking from 'expo-linking';
import * as QueryParams from 'expo-auth-session/build/QueryParams';

// Импорты экранов
import ProfileScreen from './ProfileScreen';
import BuilderScreen from './BuilderScreen';
import RecentOutfitScreen from './RecentOutfitScreen';
import FavoritesScreen from './FavoritesScreen';
import CombinationsScreen from './CombinationsScreen';
import CitySelectionScreen from './CitySelectionScreen';
import { weatherDatabase, convertTemp } from './weatherData'; 
import TemperatureSettingsScreen from './TemperatureSettingsScreen';
import NotificationsScreen from './NotificationsScreen';
import ThemeSettingsScreen from './ThemeSettingsScreen';
import ClothingPreferencesScreen from './ClothingPreferencesScreen';
import ProfileSettingsScreen from './ProfileSettingsScreen';
import { supabase } from './supabase';
import AuthScreen from './AuthScreen';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState(['start']);
  const [selectedCity, setSelectedCity] = useState('Москва');
  const [tempUnit, setTempUnit] = useState('C'); 
  const [appTheme, setAppTheme] = useState('light');
  
  const [session, setSession] = useState(null);
  
  // Данные профиля
  const [userName, setUserName] = useState('Пользователь');
  const [userEmail, setUserEmail] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);

  const currentScreen = history[history.length - 1];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const currentWeather = weatherDatabase[selectedCity] || weatherDatabase['default'];
  const isDark = appTheme === 'dark';

  // 1. ПРОВЕРКА СЕССИИ
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. ОБРАБОТКА ССЫЛОК
  useEffect(() => {
    const handleDeepLink = async (event) => {
      const { url } = event;
      if (url) {
        try {
          const { params, errorCode } = QueryParams.getQueryParams(url);
          if (errorCode) {
            Alert.alert('Ошибка', errorCode);
            return;
          }
          const { access_token, refresh_token } = params;
          if (!access_token) return;

          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) Alert.alert('Ошибка подтверждения', error.message);
          else Alert.alert('Успех', 'Почта успешно подтверждена!');
        } catch (e) {
          console.log('Ошибка обработки ссылки:', e);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });
    return () => subscription.remove();
  }, []);

  // 3. ЗАГРУЗКА ПРОФИЛЯ ИЗ БАЗЫ ПРИ ВХОДЕ
  useEffect(() => {
    if (!session) {
      // Если вышли из аккаунта, сбрасываем данные
      setUserName('Пользователь');
      setUserEmail('');
      setUserAvatar(null);
      return;
    }

    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (data) {
          setUserName(data.name || 'Пользователь');
          setUserEmail(data.email || session.user.email);
          setUserAvatar(data.avatar_url || null);
        } else {
          // Если профиля еще нет в базе, берем данные из сессии
          setUserEmail(session.user.email);
        }
      } catch (error) {
        console.log('Ошибка загрузки профиля:', error);
      }
    }
    loadProfile();
  }, [session]);

  // 4. СОХРАНЕНИЕ ПРОФИЛЯ В БАЗУ (с небольшой задержкой)
  useEffect(() => {
    if (!session) return;

    const timeout = setTimeout(async () => {
      try {
        await supabase.from('profiles').upsert({
          id: session.user.id,
          name: userName,
          email: userEmail,
          avatar_url: userAvatar,
        });
      } catch (error) {
        console.log('Ошибка сохранения профиля:', error);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [userName, userEmail, userAvatar, session]);

  // 5. ПРЕДЗАГРУЗКА КАРТИНОК
  useEffect(() => {
    async function preloadAssets() {
      try {
        await Asset.loadAsync([
          require('./assets/logo.png'), require('./assets/city_footer.png'), require('./assets/main_cat.png'),
          require('./assets/recommend_cat.png'), require('./assets/rain_cat.png'), require('./assets/weather_cat.png'),
          require('./assets/jacket.png'), require('./assets/hoodies.png'), require('./assets/T_shirt.png'), require('./assets/rain.png'),
          require('./assets/hello_cat.png'), require('./assets/cap.png'), require('./assets/shirts.png'), require('./assets/hoodi.png'), require('./assets/boots.png'), require('./assets/check.png'),
          require('./assets/switer.png'), require('./assets/cups.png'), require('./assets/palto.png'), require('./assets/shtan.png'), require('./assets/bots.png'), require('./assets/caap.png'),
          require('./assets/favorite_img1.png'), require('./assets/favorite_img2.png'), require('./assets/rainy_bg.png'), require('./assets/rain_cat_main.png') 
        ]);
      } catch (e) { console.log('Ошибка загрузки картинок:', e); } finally {
        setTimeout(() => { setIsLoading(false); Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start(); }, 3000);
      }
    }
    preloadAssets();
  }, [fadeAnim]);

  const navigateTo = (screen) => { setHistory((prev) => [...prev, screen]); };
  const goBack = () => { if (history.length > 1) setHistory((prev) => prev.slice(0, -1)); };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}><ActivityIndicator size="large" color="#ffffff" /></View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return <AuthScreen appTheme={appTheme} />;
  }

  if (currentScreen === 'profile') return <ProfileScreen onBack={goBack} onNavigate={navigateTo} selectedCity={selectedCity} tempUnit={tempUnit} appTheme={appTheme} userName={userName} userEmail={userEmail} userAvatar={userAvatar} />;
  if (currentScreen === 'profile_settings') return <ProfileSettingsScreen onBack={goBack} onNavigate={navigateTo} appTheme={appTheme} userName={userName} setUserName={setUserName} userEmail={userEmail} setUserEmail={setUserEmail} userAvatar={userAvatar} setUserAvatar={setUserAvatar} />;
  if (currentScreen === 'builder') return <BuilderScreen onBack={goBack} onNavigate={navigateTo} appTheme={appTheme} />;
  if (currentScreen === 'recent_outfit') return <RecentOutfitScreen onBack={goBack} onNavigate={navigateTo} appTheme={appTheme} />;
  if (currentScreen === 'favorites') return <FavoritesScreen onBack={goBack} onNavigate={navigateTo} appTheme={appTheme} />;
  if (currentScreen === 'combinations') return <CombinationsScreen onBack={goBack} onNavigate={navigateTo} appTheme={appTheme} />;
  if (currentScreen === 'city_selection') return <CitySelectionScreen onBack={goBack} onNavigate={navigateTo} setSelectedCity={setSelectedCity} appTheme={appTheme} />;
  if (currentScreen === 'city_selection_main') return <CitySelectionScreen onBack={goBack} onNavigate={navigateTo} setSelectedCity={setSelectedCity} redirectTo="weather" appTheme={appTheme} />;
  if (currentScreen === 'temperature_settings') return <TemperatureSettingsScreen onBack={goBack} onNavigate={navigateTo} tempUnit={tempUnit} setTempUnit={setTempUnit} appTheme={appTheme} />;
  if (currentScreen === 'notifications') return <NotificationsScreen onBack={goBack} onNavigate={navigateTo} appTheme={appTheme} />;
  if (currentScreen === 'theme_settings') return <ThemeSettingsScreen onBack={goBack} onNavigate={navigateTo} appTheme={appTheme} setAppTheme={setAppTheme} />;
  if (currentScreen === 'clothing_preferences') return <ClothingPreferencesScreen onBack={goBack} onNavigate={navigateTo} appTheme={appTheme} />;

  if (currentScreen === 'weekly') {
    const weekData = [
      { day: 'Сегодня', date: '28 мая', icon: '⛅', tempUp: '+19°', tempDown: '+11°', outfit: require('./assets/jacket.png') },
      { day: 'Чт', date: '29 мая', icon: '☁️', tempUp: '+17°', tempDown: '+9°', outfit: require('./assets/hoodies.png') },
      { day: 'Пт', date: '30 мая', icon: '🌧️', tempUp: '+15°', tempDown: '+8°', outfit: require('./assets/rain.png') },
      { day: 'Сб', date: '31 мая', icon: '⛅', tempUp: '+22°', tempDown: '+17°', outfit: require('./assets/T_shirt.png') },
      { day: 'Вс', date: '1 июня', icon: '⛅', tempUp: '+17°', tempDown: '+10°', outfit: require('./assets/jacket.png') },
      { day: 'Пн', date: '2 июня', icon: '⛅', tempUp: '+24°', tempDown: '+16°', outfit: require('./assets/T_shirt.png') },
    ];
    return (
      <SafeAreaView style={[weeklyStyles.container, isDark && { backgroundColor: '#1A1A2E' }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={weeklyStyles.scrollContent}>
          <View style={weeklyStyles.header}><TouchableOpacity onPress={goBack} style={weeklyStyles.backButton}><Text style={[weeklyStyles.backIcon, isDark && {color: '#FFF'}]}>‹</Text></TouchableOpacity><Text style={[weeklyStyles.headerTitle, isDark && {color: '#FFF'}]}>Прогноз на неделю</Text><View style={{ width: 40 }} /></View>
          <View style={[weeklyStyles.listCard, isDark && { backgroundColor: '#2A2A40' }]}>
            {weekData.map((item, index) => (
              <View key={index}>
                <View style={weeklyStyles.row}>
                  <View style={weeklyStyles.colDay}><Text style={[weeklyStyles.dayText, isDark && {color: '#FFF'}]}>{item.day}</Text><Text style={weeklyStyles.dateText}>{item.date}</Text></View>
                  <View style={weeklyStyles.colWeather}><Text style={weeklyStyles.weatherIcon}>{item.icon}</Text></View>
                  <View style={weeklyStyles.colTemp}><Text style={[weeklyStyles.tempUp, isDark && {color: '#FFF'}]}>{convertTemp(item.tempUp, tempUnit)}</Text><Text style={weeklyStyles.tempDown}>{convertTemp(item.tempDown, tempUnit)}</Text></View>
                  <View style={weeklyStyles.colOutfit}><Image source={item.outfit} style={weeklyStyles.outfitImage} resizeMode="contain" /></View>
                </View>
                {index !== weekData.length - 1 && <View style={[weeklyStyles.divider, isDark && {backgroundColor: '#444'}]} />}
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={[weeklyStyles.tabBar, isDark && { backgroundColor: '#2A2A40', borderTopColor: '#333' }]}>
          <TouchableOpacity style={weeklyStyles.tabItem} onPress={() => navigateTo('weather')}><Text style={weeklyStyles.tabIcon}>🏠</Text><Text style={weeklyStyles.tabText}>Главная</Text></TouchableOpacity>
          <TouchableOpacity style={weeklyStyles.tabItem} onPress={() => navigateTo('rec')}><Text style={weeklyStyles.tabIcon}>👕</Text><Text style={weeklyStyles.tabText}>Образ</Text></TouchableOpacity>
          <View style={weeklyStyles.tabItem}><Text style={weeklyStyles.tabIconActive}>☁️</Text><Text style={weeklyStyles.tabTextActive}>Погода</Text></View>
          <TouchableOpacity style={weeklyStyles.tabItem} onPress={() => navigateTo('favorites')}><Text style={weeklyStyles.tabIcon}>❤️</Text><Text style={weeklyStyles.tabText}>Избранное</Text></TouchableOpacity>
          <TouchableOpacity style={weeklyStyles.tabItem} onPress={() => navigateTo('profile')}><Text style={weeklyStyles.tabIcon}>👤</Text><Text style={weeklyStyles.tabText}>Профиль</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'detailed') {
    return (
      <SafeAreaView style={[detailedStyles.container, isDark && { backgroundColor: '#1A1A2E' }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={detailedStyles.scrollContent}>
          <View style={detailedStyles.header}><TouchableOpacity onPress={goBack} style={detailedStyles.backButton}><Text style={[detailedStyles.backIcon, isDark && {color: '#FFF'}]}>‹</Text></TouchableOpacity><Text style={[detailedStyles.headerTitle, isDark && {color: '#FFF'}]}>Погода</Text><View style={{ width: 40 }} /></View>
          <TouchableOpacity style={[detailedStyles.mainCard, isDark && { backgroundColor: '#2A2A40' }]} onPress={() => navigateTo('weekly')}>
            <View style={detailedStyles.mainCardLeft}><Text style={[detailedStyles.labelSmall, isDark && {color: '#FFF'}]}>Сейчас</Text><Text style={[detailedStyles.tempBig, isDark && {color: '#FFF'}]}>{convertTemp(currentWeather.temp, tempUnit)}</Text><Text style={detailedStyles.sunIcon}>{currentWeather.isBad ? '🌧️' : '☀️'}</Text></View>
            <View style={[detailedStyles.mainCardDivider, isDark && {backgroundColor: '#444'}]} />
            <View style={detailedStyles.mainCardRight}><Text style={[detailedStyles.labelSmall, isDark && {color: '#FFF'}]}>Ощущается</Text><Text style={[detailedStyles.valueMedium, isDark && {color: '#FFF'}]}>как {convertTemp(currentWeather.feelsLike, tempUnit)}</Text><Text style={[detailedStyles.labelSmall, isDark && {color: '#FFF'}]}>Ветер</Text><Text style={[detailedStyles.valueMedium, isDark && {color: '#FFF'}]}>3 м/с</Text><Text style={[detailedStyles.labelSmall, isDark && {color: '#FFF'}]}>Влажность</Text><Text style={[detailedStyles.valueMedium, isDark && {color: '#FFF'}]}>45%</Text></View>
          </TouchableOpacity>
          <View style={[detailedStyles.hourlyCard, isDark && { backgroundColor: '#2A2A40' }]}>
            <Text style={[detailedStyles.cardTitle, isDark && {color: '#FFF'}]}>По часам</Text>
            <View style={detailedStyles.hourlyRow}>
              <View style={detailedStyles.hourlyItem}><Text style={detailedStyles.hourlyTime}>10:00</Text><Text style={detailedStyles.hourlyIcon}>{currentWeather.isBad ? '🌧️' : '☀️'}</Text><Text style={[detailedStyles.hourlyTemp, isDark && {color: '#FFF'}]}>{convertTemp(currentWeather.temp, tempUnit)}</Text></View><View style={[detailedStyles.hourlyDivider, isDark && {backgroundColor: '#444'}]} />
              <View style={detailedStyles.hourlyItem}><Text style={detailedStyles.hourlyTime}>11:00</Text><Text style={detailedStyles.hourlyIcon}>{currentWeather.isBad ? '🌧️' : '☀️'}</Text><Text style={[detailedStyles.hourlyTemp, isDark && {color: '#FFF'}]}>{convertTemp(currentWeather.temp, tempUnit)}</Text></View><View style={[detailedStyles.hourlyDivider, isDark && {backgroundColor: '#444'}]} />
              <View style={detailedStyles.hourlyItem}><Text style={detailedStyles.hourlyTime}>12:00</Text><Text style={detailedStyles.hourlyIcon}>{currentWeather.isBad ? '🌧️' : '☀️'}</Text><Text style={[detailedStyles.hourlyTemp, isDark && {color: '#FFF'}]}>{convertTemp(currentWeather.temp, tempUnit)}</Text></View><View style={[detailedStyles.hourlyDivider, isDark && {backgroundColor: '#444'}]} />
              <View style={detailedStyles.hourlyItem}><Text style={detailedStyles.hourlyTime}>13:00</Text><Text style={detailedStyles.hourlyIcon}>{currentWeather.isBad ? '🌧️' : '☀️'}</Text><Text style={[detailedStyles.hourlyTemp, isDark && {color: '#FFF'}]}>{convertTemp(currentWeather.temp, tempUnit)}</Text></View><View style={[detailedStyles.hourlyDivider, isDark && {backgroundColor: '#444'}]} />
              <View style={detailedStyles.hourlyItem}><Text style={detailedStyles.hourlyTime}>14:00</Text><Text style={detailedStyles.hourlyIcon}>{currentWeather.isBad ? '🌧️' : '☀️'}</Text><Text style={[detailedStyles.hourlyTemp, isDark && {color: '#FFF'}]}>{convertTemp(currentWeather.temp, tempUnit)}</Text></View>
            </View>
          </View>
          <View style={detailedStyles.bottomSection}>
            <View style={detailedStyles.leftCol}><View style={[detailedStyles.squareCard, isDark && { backgroundColor: '#2A2A40' }]}><Text style={[detailedStyles.squareTitle, isDark && {color: '#AAA'}]}>Осадки</Text><Text style={[detailedStyles.squareValue, isDark && {color: '#FFF'}]}>{currentWeather.isBad ? '80%' : '0%'}</Text></View><View style={detailedStyles.catContainer}><Image source={require('./assets/weather_cat.png')} style={detailedStyles.weatherCatImage} resizeMode="contain" /></View></View>
            <View style={detailedStyles.rightCol}><View style={[detailedStyles.squareCard, isDark && { backgroundColor: '#2A2A40' }]}><Text style={[detailedStyles.squareTitle, isDark && {color: '#AAA'}]}>Восход</Text><Text style={[detailedStyles.squareValue, isDark && {color: '#FFF'}]}>05:42</Text></View><View style={[detailedStyles.squareCard, isDark && { backgroundColor: '#2A2A40' }]}><Text style={[detailedStyles.squareTitle, isDark && {color: '#AAA'}]}>Закат</Text><Text style={[detailedStyles.squareValue, isDark && {color: '#FFF'}]}>20:35</Text></View></View>
          </View>
        </ScrollView>
        <View style={[detailedStyles.tabBar, isDark && { backgroundColor: '#2A2A40', borderTopColor: '#333' }]}>
          <TouchableOpacity style={detailedStyles.tabItem} onPress={() => navigateTo('weather')}><Text style={detailedStyles.tabIcon}>🏠</Text><Text style={detailedStyles.tabText}>Главная</Text></TouchableOpacity>
          <TouchableOpacity style={detailedStyles.tabItem} onPress={() => navigateTo('rec')}><Text style={detailedStyles.tabIcon}>👕</Text><Text style={detailedStyles.tabText}>Образ</Text></TouchableOpacity>
          <View style={detailedStyles.tabItem}><Text style={detailedStyles.tabIconActive}>☁️</Text><Text style={detailedStyles.tabTextActive}>Погода</Text></View>
          <TouchableOpacity style={detailedStyles.tabItem} onPress={() => navigateTo('favorites')}><Text style={detailedStyles.tabIcon}>❤️</Text><Text style={detailedStyles.tabText}>Избранное</Text></TouchableOpacity>
          <TouchableOpacity style={detailedStyles.tabItem} onPress={() => navigateTo('profile')}><Text style={detailedStyles.tabIcon}>👤</Text><Text style={detailedStyles.tabText}>Профиль</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'rec') {
    return (
      <SafeAreaView style={[recStyles.container, isDark && { backgroundColor: '#1A1A2E' }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={recStyles.scrollContent}>
          <View style={recStyles.header}><TouchableOpacity onPress={goBack} style={recStyles.backButton}><Text style={[recStyles.backIcon, isDark && {color: '#FFF'}]}>‹</Text></TouchableOpacity><Text style={[recStyles.headerTitle, isDark && {color: '#FFF'}]}>Что надеть сегодня?</Text><View style={{ width: 40 }} /></View>
          <View style={recStyles.imageCard}><Image source={require('./assets/recommend_cat.png')} style={recStyles.recommendCatImage} resizeMode="cover" /><View style={recStyles.weatherBadge}><Text style={recStyles.weatherBadgeIcon}>{currentWeather.isBad ? '🌧️' : '☀️'}</Text><View><Text style={recStyles.weatherBadgeTemp}>{convertTemp(currentWeather.temp, tempUnit)}</Text><Text style={recStyles.weatherBadgeStatus}>{currentWeather.status}</Text></View></View></View>
          <View style={[recStyles.whyCard, isDark && { backgroundColor: '#2A2A40', borderColor: '#444' }]}><Text style={[recStyles.whyTitle, isDark && {color: '#FFF'}]}>Почему так?</Text><Text style={[recStyles.whyText, isDark && {color: '#DDD'}]}>Тепло, но не жарко.{'\n'}Утром и вечером прохладно,{'\n'}поэтому лёгкая куртка будет кстати.</Text><Image source={require('./assets/rain_cat.png')} style={recStyles.rainCatImage} resizeMode="contain" /></View>
          <TouchableOpacity style={recStyles.createButton} onPress={() => navigateTo('builder')}><Text style={recStyles.createButtonText}>Создать новый образ</Text></TouchableOpacity>
        </ScrollView>
        <View style={[recStyles.tabBar, isDark && { backgroundColor: '#2A2A40', borderTopColor: '#333' }]}>
          <TouchableOpacity style={recStyles.tabItem} onPress={() => navigateTo('weather')}><Text style={recStyles.tabIcon}>🏠</Text><Text style={recStyles.tabText}>Главная</Text></TouchableOpacity>
          <View style={recStyles.tabItem}><Text style={recStyles.tabIconActive}>👕</Text><Text style={recStyles.tabTextActive}>Образ</Text></View>
          <TouchableOpacity style={recStyles.tabItem} onPress={() => navigateTo('detailed')}><Text style={recStyles.tabIcon}>☁️</Text><Text style={recStyles.tabText}>Погода</Text></TouchableOpacity>
          <TouchableOpacity style={recStyles.tabItem} onPress={() => navigateTo('favorites')}><Text style={recStyles.tabIcon}>❤️</Text><Text style={recStyles.tabText}>Избранное</Text></TouchableOpacity>
          <TouchableOpacity style={recStyles.tabItem} onPress={() => navigateTo('profile')}><Text style={recStyles.tabIcon}>👤</Text><Text style={recStyles.tabText}>Профиль</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'weather') {
    return (
      <View style={[weatherStyles.container, isDark && { backgroundColor: '#1A1A2E' }]}>
        <StatusBar barStyle={currentWeather.isBad || isDark ? "light-content" : "dark-content"} />
        <Image source={currentWeather.isBad ? require('./assets/rainy_bg.png') : require('./assets/city_footer.png')} style={weatherStyles.cityBackground} resizeMode="cover" />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={weatherStyles.scrollContent}>
            <View style={weatherStyles.header}><Text style={[weatherStyles.title, (currentWeather.isBad || isDark) && { color: '#FFF' }]}>Метеокот</Text><TouchableOpacity style={weatherStyles.bellIcon}><Text style={{ fontSize: 22 }}>🔔</Text></TouchableOpacity></View>
            <View style={weatherStyles.locationContainer}><Text style={[weatherStyles.locationText, (currentWeather.isBad || isDark) && { color: '#FFF' }]}>{selectedCity}</Text><TouchableOpacity style={weatherStyles.pinIcon} onPress={() => navigateTo('city_selection_main')} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}><Text style={{ fontSize: 18 }}>📍</Text></TouchableOpacity></View>
            <View style={weatherStyles.weatherHero}><View style={weatherStyles.weatherMain}><Text style={[weatherStyles.temperature, (currentWeather.isBad || isDark) && { color: '#FFF' }]}>{convertTemp(currentWeather.temp, tempUnit)}</Text><Text style={[weatherStyles.status, (currentWeather.isBad || isDark) && { color: '#FFF' }]}>{currentWeather.status}</Text><Text style={[weatherStyles.feelsLike, (currentWeather.isBad || isDark) && { color: '#EEE' }]}>Ощущается как {convertTemp(currentWeather.feelsLike, tempUnit)}</Text><View style={weatherStyles.minMaxRow}><Text style={[weatherStyles.minMaxText, (currentWeather.isBad || isDark) && { color: '#FFF' }]}>↑{convertTemp(currentWeather.max, tempUnit)}</Text><Text style={[weatherStyles.minMaxText, (currentWeather.isBad || isDark) && { color: '#FFF' }]}>↓{convertTemp(currentWeather.min, tempUnit)}</Text></View></View><Image source={currentWeather.isBad ? require('./assets/rain_cat_main.png') : require('./assets/main_cat.png')} style={[weatherStyles.catImage, currentWeather.isBad && { width: (width * 1.1) / 2, height: (width * 1.1) / 2, right: -40, top: 10 }]} resizeMode="contain" /></View>
            <View style={[weatherStyles.card, isDark && { backgroundColor: '#2A2A40' }]}><Text style={[weatherStyles.cardTitle, isDark && {color: '#FFF'}]}>Доброе утро! {currentWeather.isBad ? '☔' : '☀️'}</Text><Text style={[weatherStyles.cardText, isDark && {color: '#DDD'}]}>Сегодня {currentWeather.isBad ? 'лучше взять зонт' : 'отличная погода для прогулок'}!</Text></View>
            <View style={[weatherStyles.card, isDark && { backgroundColor: '#2A2A40' }]}><Text style={[weatherStyles.cardTitle, isDark && {color: '#FFF'}]}>Что надеть сегодня?</Text><Text style={[weatherStyles.cardText, isDark && {color: '#DDD'}]}>{currentWeather.isBad ? 'Куртку и непромокаемую обувь' : 'Лёгкая куртка будет в самый раз'}</Text><TouchableOpacity style={weatherStyles.button} onPress={() => navigateTo('rec')}><Text style={weatherStyles.buttonText}>Посмотреть рекомендацию</Text></TouchableOpacity></View>
          </ScrollView>
        </SafeAreaView>
        <View style={[weatherStyles.tabBar, isDark && { backgroundColor: '#2A2A40', borderTopColor: '#333' }]}>
          <View style={weatherStyles.tabItem}><Text style={weatherStyles.tabIconActive}>🏠</Text><Text style={weatherStyles.tabTextActive}>Главная</Text></View>
          <TouchableOpacity style={weatherStyles.tabItem} onPress={() => navigateTo('rec')}><Text style={weatherStyles.tabIcon}>👕</Text><Text style={weatherStyles.tabText}>Образ</Text></TouchableOpacity>
          <TouchableOpacity style={weatherStyles.tabItem} onPress={() => navigateTo('detailed')}><Text style={weatherStyles.tabIcon}>☁️</Text><Text style={weatherStyles.tabText}>Погода</Text></TouchableOpacity>
          <TouchableOpacity style={weatherStyles.tabItem} onPress={() => navigateTo('favorites')}><Text style={weatherStyles.tabIcon}>❤️</Text><Text style={weatherStyles.tabText}>Избранное</Text></TouchableOpacity>
          <TouchableOpacity style={weatherStyles.tabItem} onPress={() => navigateTo('profile')}><Text style={weatherStyles.tabIcon}>👤</Text><Text style={weatherStyles.tabText}>Профиль</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}><TouchableOpacity activeOpacity={0.8} onPress={() => navigateTo('weather')}><View style={styles.logoCard}><Image source={require('./assets/logo.png')} style={styles.logoImage} /></View></TouchableOpacity></View>
      <View style={styles.bottomContainer}>{isLoading ? <ActivityIndicator size="large" color="#ffffff" /> : (<Animated.View style={{ opacity: fadeAnim }}><Text style={styles.welcomeText}>Нажмите на логотип</Text></Animated.View>)}</View>
    </SafeAreaView>
  );
}

// СТИЛИ (без изменений)
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#82C5FD' }, centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 }, logoCard: { width: 240, height: 240, backgroundColor: '#fff', borderRadius: 55, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 6 }, logoImage: { width: '100%', height: '100%', resizeMode: 'cover' }, bottomContainer: { position: 'absolute', bottom: '15%', left: 0, right: 0, alignItems: 'center', justifyContent: 'center', height: 50 }, welcomeText: { color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 } });
const weatherStyles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#DDF0FF' }, cityBackground: { position: 'absolute', top: 0, left: 0, width: width, height: height }, scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }, title: { fontSize: 26, fontWeight: '900', color: '#1A1A1A' }, bellIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 3 }, locationContainer: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginBottom: 10 }, locationText: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginRight: 8 }, pinIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 3 }, weatherHero: { position: 'relative', minHeight: 300, marginBottom: 10, justifyContent: 'flex-start' }, weatherMain: { zIndex: 2 }, temperature: { fontSize: 90, fontWeight: '900', color: '#1A1A1A', letterSpacing: -3, lineHeight: 100 }, status: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' }, feelsLike: { fontSize: 14, color: '#555', marginTop: 2 }, minMaxRow: { flexDirection: 'row', marginTop: 8 }, minMaxText: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginRight: 15 }, catImage: { position: 'absolute', right: -130, top: -60, width: width * 1.1, height: width * 1.1, zIndex: 1 }, card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 15, marginTop: -10, elevation: 3 }, cardTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 }, cardText: { fontSize: 14, color: '#333', lineHeight: 20 }, button: { backgroundColor: '#4A9BFF', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 15 }, buttonText: { color: '#fff', fontWeight: '700', fontSize: 14 }, tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 10 }, tabItem: { alignItems: 'center' }, tabIcon: { fontSize: 20, marginBottom: 2, opacity: 0.5 }, tabIconActive: { fontSize: 20, marginBottom: 2 }, tabText: { fontSize: 11, color: '#999' }, tabTextActive: { fontSize: 11, color: '#4A9BFF', fontWeight: '700' } });
const recStyles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#fff' }, scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 }, backButton: { width: 40, height: 40, justifyContent: 'center' }, backIcon: { fontSize: 40, fontWeight: '300', color: '#000', lineHeight: 40, marginTop: -5 }, headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A' }, imageCard: { position: 'relative', width: '100%', height: 300, backgroundColor: '#F7EEE5', borderRadius: 24, marginBottom: 20, overflow: 'hidden' }, recommendCatImage: { width: '100%', height: '100%' }, weatherBadge: { position: 'absolute', bottom: 15, left: 15, backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 15, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', elevation: 4 }, weatherBadgeIcon: { fontSize: 24, marginRight: 10 }, weatherBadgeTemp: { fontSize: 22, fontWeight: '900', color: '#1A1A1A', lineHeight: 24 }, weatherBadgeStatus: { fontSize: 12, color: '#333', fontWeight: '500' }, whyCard: { position: 'relative', backgroundColor: '#fff', borderRadius: 24, borderWidth: 1, borderColor: '#EFEFEF', padding: 20, marginBottom: 25, minHeight: 200 }, whyTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A', marginBottom: 10 }, whyText: { fontSize: 14, color: '#333', lineHeight: 22, fontWeight: '500', width: '55%' }, rainCatImage: { position: 'absolute', right: -10, bottom: -10, width: 160, height: 160, zIndex: 1 }, createButton: { backgroundColor: '#4A9BFF', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 20 }, createButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 }, tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15, borderTopWidth: 1, borderColor: '#EFEFEF' }, tabItem: { alignItems: 'center' }, tabIcon: { fontSize: 20, marginBottom: 2, opacity: 0.5 }, tabIconActive: { fontSize: 20, marginBottom: 2 }, tabText: { fontSize: 11, color: '#999' }, tabTextActive: { fontSize: 11, color: '#4A9BFF', fontWeight: '700' } });
const detailedStyles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#DDF0FF' }, scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 }, backButton: { width: 40, height: 40, justifyContent: 'center' }, backIcon: { fontSize: 40, fontWeight: '300', color: '#000', lineHeight: 40, marginTop: -5 }, headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A' }, mainCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, flexDirection: 'row', marginBottom: 15, elevation: 3 }, mainCardLeft: { flex: 1, alignItems: 'flex-start', justifyContent: 'center' }, labelSmall: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 }, tempBig: { fontSize: 56, fontWeight: '900', color: '#1A1A1A', letterSpacing: -2, marginVertical: 5 }, sunIcon: { fontSize: 48, marginTop: 5 }, mainCardDivider: { width: 1, backgroundColor: '#EFEFEF', marginHorizontal: 15, height: '100%' }, mainCardRight: { flex: 1.2, justifyContent: 'space-between', paddingVertical: 5 }, valueMedium: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 10 }, hourlyCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 15, elevation: 3 }, cardTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 15 }, hourlyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, hourlyItem: { alignItems: 'center', flex: 1 }, hourlyTime: { fontSize: 12, color: '#999', fontWeight: '600', marginBottom: 8 }, hourlyIcon: { fontSize: 24, marginBottom: 8 }, hourlyTemp: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' }, hourlyDivider: { width: 1, height: 40, backgroundColor: '#EFEFEF' }, bottomSection: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }, leftCol: { width: '48%', alignItems: 'center' }, rightCol: { width: '48%', alignItems: 'center' }, squareCard: { backgroundColor: '#fff', borderRadius: 24, width: '100%', height: 80, alignItems: 'center', justifyContent: 'center', marginBottom: 15, elevation: 3 }, squareTitle: { fontSize: 13, fontWeight: '700', color: '#666', marginBottom: 2 }, squareValue: { fontSize: 16, fontWeight: '900', color: '#1A1A1A' }, catContainer: { width: '100%', height: 240, alignItems: 'center', justifyContent: 'flex-end', marginTop: -70 }, weatherCatImage: { width: 240, height: 240 }, tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 10 }, tabItem: { alignItems: 'center' }, tabIcon: { fontSize: 20, marginBottom: 2, opacity: 0.5 }, tabIconActive: { fontSize: 20, marginBottom: 2 }, tabText: { fontSize: 11, color: '#999' }, tabTextActive: { fontSize: 11, color: '#4A9BFF', fontWeight: '700' } });
const weeklyStyles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#DDF0FF' }, scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 }, backButton: { width: 40, height: 40, justifyContent: 'center' }, backIcon: { fontSize: 40, fontWeight: '300', color: '#000', lineHeight: 40, marginTop: -5 }, headerTitle: { fontSize: 20, fontWeight: '900', color: '#1A1A1A' }, listCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 15, elevation: 3 }, row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }, colDay: { width: '25%' }, dayText: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' }, dateText: { fontSize: 12, color: '#666', marginTop: 2 }, colWeather: { width: '25%', alignItems: 'center' }, weatherIcon: { fontSize: 32 }, colTemp: { width: '25%', alignItems: 'center' }, tempUp: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' }, tempDown: { fontSize: 14, color: '#666' }, colOutfit: { width: '25%', alignItems: 'center' }, outfitImage: { width: 64, height: 64 }, divider: { height: 1, backgroundColor: '#EFEFEF', marginVertical: 4 }, tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 10 }, tabItem: { alignItems: 'center' }, tabIcon: { fontSize: 20, marginBottom: 2, opacity: 0.5 }, tabIconActive: { fontSize: 20, marginBottom: 2 }, tabText: { fontSize: 11, color: '#999' }, tabTextActive: { fontSize: 11, color: '#4A9BFF', fontWeight: '700' } });