import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { supabase } from './supabase';

export default function AuthScreen({ appTheme }) {
  const isDark = appTheme === 'dark';
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Стейты для показа/скрытия паролей
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    if (!isLoginMode && password !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают. Пожалуйста, проверьте ввод.');
      return;
    }

    setLoading(true);

    if (isLoginMode) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert('Ошибка входа', error.message);
    } else {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: 'meteocat://'
        }
      });
      
      if (error) {
        Alert.alert('Ошибка регистрации', error.message);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
           Alert.alert('Успех', 'Аккаунт создан! Теперь вы можете войти.');
           setIsLoginMode(true);
        }
      }
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#1A1A2E' }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <Text style={[styles.title, isDark && { color: '#FFF' }]}>МетеоКот</Text>
          <Text style={[styles.subtitle, isDark && { color: '#AAA' }]}>
            {isLoginMode ? 'Войдите в аккаунт' : 'Создайте аккаунт'}
          </Text>

          <TextInput
            style={[styles.input, isDark && { backgroundColor: '#2A2A40', color: '#FFF', borderColor: '#444' }]}
            placeholder="Email"
            placeholderTextColor={isDark ? '#888' : '#999'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Поле пароля с глазом */}
          <View style={[styles.passwordContainer, isDark && { backgroundColor: '#2A2A40', borderColor: '#444' }]}>
            <TextInput
              style={[styles.inputInside, isDark && { color: '#FFF' }]}
              placeholder="Пароль"
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Поле подтверждения пароля с глазом */}
          {!isLoginMode && (
            <View style={[styles.passwordContainer, isDark && { backgroundColor: '#2A2A40', borderColor: '#444' }]}>
              <TextInput
                style={[styles.inputInside, isDark && { color: '#FFF' }]}
                placeholder="Повторите пароль"
                placeholderTextColor={isDark ? '#888' : '#999'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                <Text style={styles.eyeIcon}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Загрузка...' : (isLoginMode ? 'Войти' : 'Зарегистрироваться')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchModeButton} onPress={toggleMode}>
            <Text style={styles.switchModeText}>
              {isLoginMode ? 'Нет аккаунта? Зарегистрируйся!' : 'Уже есть аккаунт? Войти'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DDF0FF' },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 30, paddingBottom: 50 },
  title: { fontSize: 32, fontWeight: '900', color: '#1A1A1A', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  
  input: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 15, height: 50, fontSize: 16, color: '#1A1A1A', marginBottom: 15, borderWidth: 1, borderColor: 'transparent' },
  
  // Новые стили для поля с глазом
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputInside: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1A1A1A',
  },
  eyeButton: {
    paddingHorizontal: 15,
    height: '100%',
    justifyContent: 'center',
  },
  eyeIcon: {
    fontSize: 20,
  },

  button: { backgroundColor: '#4A9BFF', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  switchModeButton: { marginTop: 20, alignItems: 'center', paddingVertical: 10 },
  switchModeText: { color: '#4A9BFF', fontWeight: '700', fontSize: 15, textAlign: 'center' },
});