import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft
} from 'react-native-reanimated';
import ProgressBar from './ProgressBar';

interface StepLayoutProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  direction?: 'forward' | 'backward';
}

const StepLayout: React.FC<StepLayoutProps> = ({ 
  currentStep, 
  totalSteps, 
  children, 
  direction = 'forward' 
}) => {
  const screenOpacity = useSharedValue(0);
  const screenTranslateX = useSharedValue(direction === 'forward' ? 50 : -50);

  React.useEffect(() => {
    // Animate screen in
    screenOpacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    screenTranslateX.value = withTiming(0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [currentStep]);

  const screenAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: screenOpacity.value,
      transform: [{ translateX: screenTranslateX.value }],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Progress Bar at Top */}
      <View style={styles.progressContainer}>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </View>
      
      {/* Animated Content Area */}
      <Animated.View style={[styles.contentContainer, screenAnimatedStyle]}>
        {children}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8', // Light background for the app
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
});

export default StepLayout; 