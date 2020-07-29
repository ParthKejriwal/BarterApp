import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import SignUpLoginScreen from './screens/SignUpLoginScreen';

export default function App() {
  return (
    <SignUpLoginScreen>
    </SignUpLoginScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});