import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '../context/NavigationContext';

interface AnimatedScreenProps {
  children: React.ReactNode;
  direction?: 1 | -1; // 1 for forward, -1 for backward
  isVisible?: boolean;
  screenKey?: string; // Add screen key to trigger animation on navigation
}

const AnimatedScreen: React.FC<AnimatedScreenProps> = ({ 
  children, 
  direction = 1, 
  isVisible = true,
  screenKey 
}) => {
  const { currentScreen } = useNavigation();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(direction * 50)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  // Reset animation values when screen changes
  useEffect(() => {
    // Reset to initial state
    opacity.setValue(0);
    translateX.setValue(direction * 50);
    scale.setValue(0.95);
    
    // Trigger animation
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, [currentScreen, direction]); // Trigger on currentScreen change

  const animatedStyle = {
    opacity,
    transform: [
      { translateX },
      { scale },
    ],
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default AnimatedScreen; 