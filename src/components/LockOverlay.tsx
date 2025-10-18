import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, Button } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../store/authSlice';
import { colors } from '../styles/theme';

interface LockOverlayProps {
  visible: boolean;
}

export default function LockOverlay({ visible }: LockOverlayProps) {
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      const rnBiometrics = new ReactNativeBiometrics();
      rnBiometrics.simplePrompt({ promptMessage: 'Unlock with Biometrics' })
        .then((resultObject) => {
          const { success } = resultObject;
          if (success) {
            dispatch(setUser({ username: 'admin' }));
            dispatch(setToken('restored-token'));
          } else {
            setError('Biometric failed');
          }
        })
        .catch(() => setError('Biometric error'));
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent>
      <View style={styles.overlay}>
        <Text style={styles.text}>App Locked</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Use Password" onPress={() => {}} color={colors.button} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: colors.white,
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  error: {
    color: colors.danger,
    marginBottom: 10,
    fontSize: 16,
  },
});
