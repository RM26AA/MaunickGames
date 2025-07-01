// screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the logo scale
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 4,
      tension: 70,
      useNativeDriver: true,
    }).start();

    // Navigate after 2.5s
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo1.png')}
        style={[styles.logo, { transform: [{ scale: logoScale }] }]}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 180,
    width: 180,
  },
});

