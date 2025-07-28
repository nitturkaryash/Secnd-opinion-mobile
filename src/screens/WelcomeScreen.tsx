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
import mentalWellnessDesignSystem from '../../DesignSystem';

interface ServiceCardProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  iconBackgroundColor?: string;
  subtitleOpacity?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, subtitle, icon, onPress, backgroundColor, textColor = mentalWellnessDesignSystem.colorSystem.system.text.onDark, iconColor, iconBackgroundColor, subtitleOpacity }) => (
  <TouchableOpacity style={[styles.serviceCard, { backgroundColor }]} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.cardIconContainer, { backgroundColor: iconBackgroundColor || (textColor === '#000000' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)') }]}>
      <Ionicons name={icon} size={28} color={iconColor || textColor} />
    </View>
    <View style={styles.cardTextContent}>
      <Text style={[styles.cardTitle, { color: textColor }]}>{title}</Text>
      <Text style={[styles.cardSubtitle, { color: textColor, opacity: subtitleOpacity !== undefined ? subtitleOpacity : (textColor === '#000000' ? 0.7 : 0.9) }]}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const TrustBadge: React.FC<{ label: string; icon: keyof typeof Ionicons.glyphMap }> = ({ label, icon }) => (
  <View style={styles.trustBadge}>
    <View style={styles.trustIconContainer}>
      <Ionicons name={icon} size={18} color={mentalWellnessDesignSystem.colorSystem.system.text.onDark} />
    </View>
    <Text style={styles.trustBadgeText}>{label}</Text>
  </View>
);

const WelcomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleServicePress = (serviceType: string) => {
    console.log(`${serviceType} selected`);
    navigation.navigate('Sign Up');
  };

  const handleGetStarted = () => {
    navigation.navigate('Sign Up');
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <View style={styles.logoCircle}>
              <Ionicons 
                name="medical" 
                size={32} 
                color={mentalWellnessDesignSystem.colorSystem.system.text.onDark}
              />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greeting}>Hello! 👋</Text>
              <Text style={styles.appName}>SecondOpinion</Text>
            </View>
          </View>
          <Text style={styles.tagline}>
            Get expert medical consultation from trusted healthcare professionals
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Service Selection Cards */}
          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitle}>Choose Your Service</Text>
            
            <View style={styles.cardsContainer}>
              <ServiceCard
                title="Self-Service"
                subtitle="Upload documents and get consultation online"
                icon="document-text"
                backgroundColor="#000000"
                textColor="#FFFFFF"
                iconColor="#000000"
                iconBackgroundColor="#99E2F4"
                onPress={() => handleServicePress('Self-Service')}
              />
              
              <ServiceCard
                title="Assisted Help"
                subtitle="Get personalized assistance from our team"
                icon="people"
                backgroundColor="#FFFFFF"
                textColor="#000000"
                iconColor="#000000"
                iconBackgroundColor="#99E2F4"
                onPress={() => handleServicePress('Assisted Help')}
              />
            </View>
          </View>

          {/* Trust Section */}
          <View style={styles.trustSection}>
            <Text style={styles.sectionTitle}>Why Choose Us</Text>
            <View style={styles.trustContainer}>
              <TrustBadge label="HIPAA Compliant" icon="shield-checkmark" />
              <TrustBadge label="24/7 Support" icon="time" />
              <TrustBadge label="Expert Doctors" icon="medical" />
            </View>
          </View>

          {/* Get Started Section */}
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
                color={mentalWellnessDesignSystem.colorSystem.system.text.accent} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: mentalWellnessDesignSystem.colorSystem.emotions.neutral.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#99e2f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    ...mentalWellnessDesignSystem.elementStyling.emotionCircle.container.default.shadow,
    elevation: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: mentalWellnessDesignSystem.colorSystem.system.text.accent,
    marginBottom: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: mentalWellnessDesignSystem.colorSystem.system.text.accent,
  },
  tagline: {
    fontSize: 16,
    lineHeight: 24,
    color: mentalWellnessDesignSystem.colorSystem.system.text.secondary,
    paddingHorizontal: 8,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  servicesSection: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: mentalWellnessDesignSystem.colorSystem.system.text.accent,
    marginBottom: 24,
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  serviceCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 24,
    padding: 20,
    ...mentalWellnessDesignSystem.elementStyling.cards.activityCard.container.default.shadow,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    minHeight: 140,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTextContent: {
    flex: 1,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  trustSection: {
    marginBottom: 48,
  },
  trustContainer: {
    backgroundColor: mentalWellnessDesignSystem.colorSystem.system.background.light,
    borderRadius: 24,
    padding: 24,
    ...mentalWellnessDesignSystem.elementStyling.cards.activityCard.container.default.shadow,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  trustIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#99e2f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  trustBadgeText: {
    fontSize: 16,
    fontWeight: '500',
    color: mentalWellnessDesignSystem.colorSystem.system.text.accent,
    flex: 1,
  },
  actionSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: mentalWellnessDesignSystem.elementStyling.buttons.primary.default.background,
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 48,
    ...mentalWellnessDesignSystem.elementStyling.buttons.primary.default.shadow,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    width: '100%',
    justifyContent: 'center',
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '600',
    color: mentalWellnessDesignSystem.elementStyling.buttons.primary.default.color,
    marginRight: 12,
  },
});

export default WelcomeScreen; 