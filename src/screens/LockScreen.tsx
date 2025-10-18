import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import ReactNativeBiometrics from "react-native-biometrics";
import { LockContext } from "../contexts/LockContext";

export default function LockScreen() {
  const { unlockApp } = useContext(LockContext);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (authenticated) return;

    const rnBiometrics = new ReactNativeBiometrics();

    rnBiometrics.isSensorAvailable()
      .then(({ available, biometryType }) => {
        if (available && biometryType) {
          rnBiometrics.simplePrompt({ promptMessage: "Unlock Flower Store 💐" })
            .then(({ success }) => {
              if (success) {
                setAuthenticated(true);
                unlockApp();
              } else {
                setErrorMessage("Authentication cancelled by user.");
              }
            })
            .catch(err => {
              console.log("Biometrics error:", err);
              setErrorMessage(err.message || "Authentication failed.");
            });
        } else {
          setErrorMessage("This device doesn't support fingerprint or face unlock.");
        }
      })
      .catch(err => {
        console.log("Sensor error:", err);
        setErrorMessage(err.message || "Authentication failed.");
      });
  }, [authenticated]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure Access 🔒</Text>
      <Image
        source={require("../../assets/fingerprint.png")}
        style={styles.fingerprint}
      />
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <TouchableOpacity style={styles.button} onPress={() => unlockApp()}>
        <Text style={styles.buttonText}>Unlock Manually</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fce7f3",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#7e22ce",
    marginBottom: 40,
  },
  fingerprint: {
    width: 120,
    height: 120,
    tintColor: "#9333ea",
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#9333ea",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
