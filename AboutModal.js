import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';

export default function AboutModal({ visible, onClose, appTheme }) {
  const isDark = appTheme === 'dark';

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalView, isDark && { backgroundColor: '#2A2A40' }]}>
          <Text style={[styles.title, isDark && { color: '#FFF' }]}>О приложении</Text>
          
          <Text style={[styles.text, isDark && { color: '#DDD' }]}>
            <Text style={{ fontWeight: 'bold' }}>МетеоКот</Text> — это ваш милый помощник в мире погоды! 🐱
            {'\n\n'}
            В приложении вы можете смотреть точный прогноз погоды для вашего города, а также получать персональные рекомендации по стилю одежды, чтобы чувствовать себя комфортно в любую погоду.
          </Text>

          <TouchableOpacity 
            style={styles.button} 
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Понятно</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Затемнение фона
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  text: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#4A9BFF',
    borderRadius: 14,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});