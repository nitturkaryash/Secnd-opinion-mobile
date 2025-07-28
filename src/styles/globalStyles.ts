import { StyleSheet } from 'react-native';
import mentalWellnessDesignSystem, { getEmotionColors, getComponentStyle } from '../../DesignSystem';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mentalWellnessDesignSystem.colorSystem.system.background.light,
  },
  screenPadding: {
    paddingHorizontal: 20,
  },
  heading1: {
    color: mentalWellnessDesignSystem.colorSystem.system.text.accent,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  heading2: {
    color: mentalWellnessDesignSystem.colorSystem.system.text.accent,
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
  },
  bodyText: {
    color: mentalWellnessDesignSystem.colorSystem.system.text.accent,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  captionText: {
    color: mentalWellnessDesignSystem.colorSystem.system.text.secondary,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: mentalWellnessDesignSystem.elementStyling.buttons.primary.default.background,
    borderRadius: parseInt(mentalWellnessDesignSystem.elementStyling.buttons.primary.default.borderRadius),
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: mentalWellnessDesignSystem.elementStyling.buttons.primary.default.color,
  },
  card: {
    backgroundColor: mentalWellnessDesignSystem.elementStyling.cards.activityCard.container.default.background,
    borderRadius: parseInt(mentalWellnessDesignSystem.visualEffectRules.borderRadius.cards),
    padding: parseInt(mentalWellnessDesignSystem.elementStyling.cards.activityCard.container.default.padding),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: mentalWellnessDesignSystem.colorSystem.system.interactive.secondary,
    borderRadius: parseInt(mentalWellnessDesignSystem.visualEffectRules.borderRadius.emotionTags),
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: mentalWellnessDesignSystem.colorSystem.system.text.accent,
    backgroundColor: mentalWellnessDesignSystem.colorSystem.system.background.light,
    marginBottom: 16,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: mentalWellnessDesignSystem.colorSystem.system.interactive.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});

export const colors = {
  // Primary healthcare colors from design system
  primary: '#99e2f4',
  primaryHappy: mentalWellnessDesignSystem.colorSystem.emotions.happy.primary,
  secondary: mentalWellnessDesignSystem.colorSystem.system.interactive.primary,
  background: mentalWellnessDesignSystem.colorSystem.system.background.light,
  cardBackground: mentalWellnessDesignSystem.elementStyling.cards.activityCard.container.default.background as string,
  textPrimary: mentalWellnessDesignSystem.colorSystem.system.text.accent,
  textSecondary: mentalWellnessDesignSystem.colorSystem.system.text.secondary,
  border: '#E0E0E0',
  success: mentalWellnessDesignSystem.colorSystem.system.interactive.success,
  warning: mentalWellnessDesignSystem.colorSystem.system.interactive.warning,
  error: mentalWellnessDesignSystem.colorSystem.system.interactive.error,
  // Interactive elements
  activeTab: '#99e2f4',
  buttonPrimary: mentalWellnessDesignSystem.colorSystem.system.interactive.primary,
  buttonText: mentalWellnessDesignSystem.colorSystem.system.text.onDark,
}; 