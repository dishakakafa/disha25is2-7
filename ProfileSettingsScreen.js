import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, ScrollView, StatusBar, TextInput, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './supabase';

export default function ProfileSettingsScreen({ onBack, onNavigate, appTheme, userName, setUserName, userEmail, setUserEmail, userAvatar, setUserAvatar }) {
  const isDark = appTheme === 'dark';
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Ошибка", "Вы не разрешили доступ к галерее!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setLoading(true);
      try {
        const uri = result.assets[0].uri;
        const fileExt = uri.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const response = await fetch(uri);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, blob, { contentType: `image/${fileExt}` });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        setUserAvatar(urlData.publicUrl);
      } catch (error) {
        Alert.alert('Ошибка загрузки фото', error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Нет сессии');

      await supabase.from('profiles').upsert({
        id: session.user.id,
        name: userName,
        email: userEmail,
        avatar_url: userAvatar,
      });

      alert('Профиль успешно сохранен!');
      onBack();
    } catch (e) {
      alert('Ошибка при сохранении: ' + e.message);
    } finally {
      setLoading(false);
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
          <Text style={[styles.headerTitle, isDark && { color: '#FFF' }]}>Настройки профиля</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={[styles.settingsCard, isDark && { backgroundColor: '#2A2A40' }]}>
          
          <View style={styles.avatarSection}>
            <View style={[styles.avatarContainer, isDark && { backgroundColor: '#1A1A2E' }]}>
              <Image 
                source={userAvatar ? { uri: userAvatar } : require('./assets/hello_cat.png')} 
                style={styles.avatarImage} 
                resizeMode="cover" 
              />
              {loading && <ActivityIndicator size="small" color="#4A9BFF" style={{position: 'absolute'}} />}
            </View>
            <TouchableOpacity onPress={pickImage} disabled={loading}>
              <Text style={styles.changeAvatarText}>{loading ? 'Загрузка...' : 'Изменить фото'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, isDark && { color: '#AAA' }]}>Имя</Text>
          <TextInput 
            style={[styles.input, isDark && { backgroundColor: '#1A1A2E', color: '#FFF', borderColor: '#444' }]} 
            value={userName} 
            onChangeText={setUserName} 
          />

          <Text style={[styles.label, isDark && { color: '#AAA' }]}>Электронная почта</Text>
          <TextInput 
            style={[styles.input, isDark && { backgroundColor: '#1A1A2E', color: '#FFF', borderColor: '#444' }]} 
            value={userEmail} 
            onChangeText={setUserEmail} 
            keyboardType="email-address"
            autoCapitalize="none"
            editable={false} // Почту менять нельзя (это логин)
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
            <Text style={styles.saveButtonText}>{loading ? 'Сохранение...' : 'Сохранить изменения'}</Text>
          </TouchableOpacity>

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
  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#DDF0FF', overflow: 'hidden', marginBottom: 10, justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: '100%', height: '100%' },
  changeAvatarText: { color: '#4A9BFF', fontSize: 14, fontWeight: '700' },
  label: { fontSize: 14, fontWeight: '700', color: '#666', marginBottom: 5 },
  input: { backgroundColor: '#F0F5FA', borderRadius: 12, paddingHorizontal: 15, height: 50, fontSize: 16, color: '#1A1A1A', marginBottom: 15, borderWidth: 1, borderColor: 'transparent' },
  saveButton: { backgroundColor: '#4A9BFF', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 15, borderTopWidth: 1, borderColor: '#EFEFEF' },
  tabItem: { alignItems: 'center' }, tabIcon: { fontSize: 20, marginBottom: 2, opacity: 0.5 }, tabIconActive: { fontSize: 20, marginBottom: 2 }, tabText: { fontSize: 11, color: '#999' }, tabTextActive: { fontSize: 11, color: '#4A9BFF', fontWeight: '700' },
});