import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

export default function BiometricScreen({ onFail }: { onFail: () => void }) {
  return (
    <ImageBackground
      source={require('../assets/lock-background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>🔒 التطبيق مقفول</Text>
        <Text style={styles.error}>حدث خطأ في البصمة</Text>

        <TouchableOpacity style={styles.button} onPress={onFail}>
          <Text style={styles.buttonText}>استخدام كلمة المرور</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 30,
    margin: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    color: '#fff',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  error: {
    fontSize: 18,
    color: '#ff4d4d',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6a1b9a',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
