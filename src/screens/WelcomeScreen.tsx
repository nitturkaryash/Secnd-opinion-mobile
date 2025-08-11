import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '../styles/globalStyles';
import AnimatedScreen from '../components/AnimatedScreen';

import { useNavigation } from '../context/NavigationContext';

const WelcomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { setDirection } = useNavigation();

  const handleGetStarted = () => {
    setDirection(1);
    // @ts-ignore - navigation prop from tab navigator
    navigation.navigate('SignUp');
  };

  const features = [
    {
      icon: 'medical',
      title: 'Expert Second Opinions',
      description: 'Get professional medical opinions from top specialists',
      color: '#2766E1',
    },
    {
      icon: 'shield-checkmark',
      title: 'Secure & Confidential',
      description: 'Your medical data is protected with bank-level security',
      color: '#4CAF50',
    },
    {
      icon: 'time',
      title: 'Quick Turnaround',
      description: 'Receive expert opinions within 24-48 hours',
      color: '#FF9800',
    },
  ];

  return (
    <AnimatedScreen direction={1} screenKey="Welcome">
      <SafeAreaView style={[globalStyles.container, styles.container]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerCard}>
              <View style={styles.headerIcon}>
                <Ionicons 
                  name="heart" 
                  size={32} 
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.title}>Welcome to SecondOpinion</Text>
              <Text style={styles.subtitle}>
                Get expert medical second opinions from top specialists worldwide
              </Text>
            </View>
          </View>

          {/* Features Section */}
          <View style={styles.content}>
            <View style={styles.featuresSection}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureCard}>
                  <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                    <Ionicons 
                      name={feature.icon as any} 
                      size={28} 
                      color="#FFFFFF"
                    />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Action Section */}
            <View style={styles.actionSection}>
              <TouchableOpacity
                style={styles.getStartedButton}
                onPress={handleGetStarted}
                activeOpacity={0.8}
              >
                <Text style={styles.getStartedText}>Get Started</Text>
                <Ionicons 
                  name="arrow-forward" 
                  size={20} 
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account?</Text>
                <TouchableOpacity style={styles.signInButton}>
                  <Text style={styles.signInLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
      scrollContent: {
      flexGrow: 1,

      paddingBottom: 20,
    },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 24,
    flex: 1,
  },
  featuresSection: {
    marginBottom: 48,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
  },
  actionSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 48,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
    justifyContent: 'center',
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 12,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  signInText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
  signInButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  signInLink: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default WelcomeScreen; 