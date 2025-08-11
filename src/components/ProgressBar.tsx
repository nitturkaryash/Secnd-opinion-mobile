import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing,
  interpolate,
  runOnJS
} from 'react-native-reanimated';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps, 
  animated = true 
}) => {
  const progressValue = useSharedValue(0);
  const textOpacity = useSharedValue(1);

  useEffect(() => {
    const targetProgress = (currentStep / totalSteps) * 100;
    
    if (animated) {
      // Animate text fade out
      textOpacity.value = withTiming(0, { duration: 150 }, () => {
        // Update progress
        progressValue.value = withTiming(targetProgress, {
          duration: 600,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }, () => {
          // Animate text fade in
          textOpacity.value = withTiming(1, { duration: 150 });
        });
      });
    } else {
      progressValue.value = targetProgress;
    }
  }, [currentStep, totalSteps, animated]);

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value}%`,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  return (
    <View style={styles.progressSection}>
      <Animated.Text style={[styles.progressLabel, textAnimatedStyle]}>
        Step {currentStep} of {totalSteps}
      </Animated.Text>
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2766E1', // Sky blue for progress bar
    borderRadius: 4,
  },
});

export default ProgressBar; 