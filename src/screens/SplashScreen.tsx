import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, StatusBar, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, Typography, Spacing } from '../theme';
import AppText from '../components/AppText';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

// Safely resolve the logo — if the asset doesn't exist the require() call
// itself would throw at bundle time, so we guard it with a try/catch.
let logoSource: number | null = null;
try {
  logoSource = require('../../assets/logo.png');
} catch {
  logoSource = null;
}

const SplashScreen = ({ navigation }: Props) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(0)).current;
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(dotScale, {
          toValue: 1,
          tension: 80,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2800);

    return () => clearTimeout(timer);
  }, [navigation, logoScale, logoOpacity, textOpacity, taglineOpacity, dotScale]);

  const showImage = logoSource !== null && !imgError;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primaryDark} barStyle="light-content" />

      {/* Background decorative circles */}
      <View style={styles.circleLarge} />
      <View style={styles.circleSmall} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoWrap,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <View style={styles.logoInner}>
          {showImage ? (
            <Image
              source={logoSource as number}
              style={styles.logoImage}
              resizeMode="contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <AppText style={styles.logoEmoji}>🍽️</AppText>
          )}
        </View>
      </Animated.View>

      {/* App name */}
      <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
        <AppText style={styles.appName}>RestroBill</AppText>

        <Animated.View style={[styles.taglineRow, { opacity: taglineOpacity }]}>
          <Animated.View
            style={[styles.dot, { transform: [{ scale: dotScale }] }]}
          />
          <AppText style={styles.tagline}>Smart Restaurant POS</AppText>
          <Animated.View
            style={[styles.dot, { transform: [{ scale: dotScale }] }]}
          />
        </Animated.View>
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <AppText style={styles.version}>Version 1.0.0</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleLarge: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -100,
    right: -100,
  },
  circleSmall: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -50,
    left: -50,
  },
  logoWrap: {
    marginBottom: Spacing.xxl,
  },
  logoInner: {
    width: 180,
    height: 180,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoImage: {
    width: 160,
    height: 160,
  },
  logoEmoji: {
    fontSize: 70,
  },
  appName: {
    fontSize: 42,
    fontWeight: Typography.fontWeightExtraBold,
    color: Colors.textInverse,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  tagline: {
    fontSize: Typography.fontSizeLG,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: Typography.fontWeightMedium,
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: Spacing.xxxl,
  },
  version: {
    fontSize: Typography.fontSizeSM,
    color: 'rgba(255,255,255,0.5)',
  },
});

export default SplashScreen;
