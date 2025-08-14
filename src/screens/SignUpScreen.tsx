import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '../styles/globalStyles';
import mentalWellnessDesignSystem from '../../DesignSystem';
import AnimatedScreen from '../components/AnimatedScreen';
import { useNavigation } from '../context/NavigationContext';
import supabase from '../lib/supabase';
import { TablesInsert } from '../types/database.types';


interface FormData {
  emailPhone: string;
  password: string;
  confirmPassword: string;
  aadhaar: string;
  otp: string;
  termsAccepted: boolean;
}

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { setDirection } = useNavigation();
  const [formData, setFormData] = useState<FormData>({
    emailPhone: '',
    password: '',
    confirmPassword: '',
    aadhaar: '',
    otp: '',
    termsAccepted: false,
  });
  
  const [focusedField, setFocusedField] = useState<string>('');
  const [otpSent, setOtpSent] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const sendOtp = async () => {
    if (!formData.emailPhone) {
      Alert.alert('Error', 'Please enter email or phone number');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOtp({
      email: formData.emailPhone,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      setError(error.message);
      Alert.alert('Error sending OTP', error.message);
    } else {
      setOtpSent(true);
      Alert.alert('Success', 'OTP sent successfully!');
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!formData.emailPhone || !formData.password || !formData.aadhaar) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!formData.termsAccepted) {
      Alert.alert('Error', 'Please accept terms and conditions');
      return;
    }

    if (!otpSent || !formData.otp) {
      Alert.alert('Error', 'Please verify your OTP');
      return;
    }

    setLoading(true);
    setError('');

    const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
      email: formData.emailPhone,
      token: formData.otp,
      type: 'email',
    });

    if (verifyError) {
      setError(verifyError.message);
      Alert.alert('Error verifying OTP', verifyError.message);
      setLoading(false);
      return;
    }

    if (session?.user) {
      const patientData: TablesInsert<'patients'> = {
        id: session.user.id,
        name: 'New Patient', // Placeholder, ideally from another form field
        // aadhaar_number: formData.aadhaar, // Assuming you add this column
        email: formData.emailPhone,
      };

      const { error: insertError } = await supabase.from('patients').insert(patientData);

      if (insertError) {
        setError(insertError.message);
        Alert.alert('Error creating patient profile', insertError.message);
        setLoading(false);
        return;
      }
      
      // Set direction for forward navigation
      setDirection(1);
      // @ts-ignore - navigation prop from tab navigator
      navigation.navigate('Upload');
    }
    
    setLoading(false);
  };

  const getInputStyle = (fieldName: string) => [
    styles.input,
    focusedField === fieldName && styles.inputFocused,
  ];

  return (
    <AnimatedScreen direction={1} screenKey="SignUp">
      <SafeAreaView style={[globalStyles.container, styles.container]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerCard}>
              <View style={styles.headerIcon}>
                <Ionicons 
                  name="person-add" 
                  size={32} 
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join thousands of users getting expert medical opinions
              </Text>
            </View>
          </View>

          {/* Form Content */}
          <View style={styles.content}>
            <View style={styles.formSections}>
              {/* Basic Information Card */}
              <View style={styles.formCard}>
                <Text style={styles.cardHeader}>Basic Information</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email or Phone Number</Text>
                  <TextInput
                    style={getInputStyle('emailPhone')}
                    placeholder="Enter your email or phone number"
                    placeholderTextColor={mentalWellnessDesignSystem.colorSystem.system.text.secondary}
                    value={formData.emailPhone}
                    onChangeText={(text) => updateFormData('emailPhone', text)}
                    onFocus={() => setFocusedField('emailPhone')}
                    onBlur={() => setFocusedField('')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[getInputStyle('password'), styles.passwordInput]}
                      placeholder="Enter your password"
                      placeholderTextColor={mentalWellnessDesignSystem.colorSystem.system.text.secondary}
                      value={formData.password}
                      onChangeText={(text) => updateFormData('password', text)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      secureTextEntry={!passwordVisible}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                      <Ionicons
                        name={passwordVisible ? 'eye' : 'eye-off'}
                        size={20}
                        color="#2766E1"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={getInputStyle('confirmPassword')}
                    placeholder="Confirm your password"
                    placeholderTextColor={mentalWellnessDesignSystem.colorSystem.system.text.secondary}
                    value={formData.confirmPassword}
                    onChangeText={(text) => updateFormData('confirmPassword', text)}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                    secureTextEntry={true}
                  />
                </View>
              </View>

              {/* Verification Card */}
              <View style={styles.formCard}>
                <Text style={styles.cardHeader}>Verification</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Aadhaar Number</Text>
                  <TextInput
                    style={getInputStyle('aadhaar')}
                    placeholder="Enter your 12-digit Aadhaar number"
                    placeholderTextColor={mentalWellnessDesignSystem.colorSystem.system.text.secondary}
                    value={formData.aadhaar}
                    onChangeText={(text) => updateFormData('aadhaar', text.replace(/\D/g, '').slice(0, 12))}
                    onFocus={() => setFocusedField('aadhaar')}
                    onBlur={() => setFocusedField('')}
                    keyboardType="numeric"
                    maxLength={12}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>OTP Verification</Text>
                  <View style={styles.otpContainer}>
                    <TextInput
                      style={[getInputStyle('otp'), styles.otpInput]}
                      placeholder="Enter 6-digit OTP"
                      placeholderTextColor={mentalWellnessDesignSystem.colorSystem.system.text.secondary}
                      value={formData.otp}
                      onChangeText={(text) => updateFormData('otp', text.replace(/\D/g, '').slice(0, 6))}
                      onFocus={() => setFocusedField('otp')}
                      onBlur={() => setFocusedField('')}
                      keyboardType="numeric"
                      maxLength={6}
                    />
                    <TouchableOpacity
                      style={styles.sendOtpButton}
                      onPress={sendOtp}
                      activeOpacity={0.8}
                      disabled={loading}
                    >
                      <Text style={styles.sendOtpText}>{loading ? 'Sending...' : (otpSent ? 'Resend' : 'Send OTP')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Terms and Conditions */}
              <View style={styles.formCard}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => updateFormData('termsAccepted', !formData.termsAccepted)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, formData.termsAccepted && styles.checkedBox]}>
                    {formData.termsAccepted && (
                      <Ionicons 
                        name="checkmark" 
                        size={16} 
                        color="#2766E1" 
                      />
                    )}
                  </View>
                  <Text style={styles.checkboxText}>
                    I accept the{' '}
                    <Text style={styles.linkText}>Terms and Conditions</Text>
                    {' '}and{' '}
                    <Text style={styles.linkText}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionSection}>
                {error ? <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{error}</Text> : null}
                <TouchableOpacity
                  style={[styles.submitButton, loading && styles.disabledButton]}
                  onPress={handleSignUp}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  <Text style={styles.submitButtonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
                  <Ionicons 
                    name="arrow-forward" 
                    size={20} 
                    color="#2766E1"
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF', // Changed to pure white background
  },
      scrollContent: {
      flexGrow: 1,

      paddingBottom: 20,
    },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#FFFFFF', // Pure white fill
    borderRadius: 16, // 16px corner radius
    paddingTop: 32, // 32px top padding
    paddingBottom: 32, // 32px bottom padding
    paddingHorizontal: 24, // 24px left & right padding
    alignItems: 'center',
    width: '100%',
    // Soft 8px blur shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  headerIcon: {
    width: 72, // 72px circle
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2766E1', // Sky blue background
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // 20px margin below icon
  },
  title: {
    fontSize: 24, // Bold 24pt system font
    fontWeight: '700', // Bold weight
    color: '#222222', // Charcoal color
    marginBottom: 12, // 12px below heading (adjusted from 20px to account for body copy spacing)
    textAlign: 'center', // Center-aligned
  },
  subtitle: {
    fontSize: 14, // Regular 14pt
    fontWeight: '400', // Regular weight
    lineHeight: 20,
    textAlign: 'center', // Center-aligned
    color: '#666666', // Muted gray
    maxWidth: 260, // Max-width 260px
  },
  formSections: {
    gap: 24,
  },
  formCard: {
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
  termsCard: {
    backgroundColor: mentalWellnessDesignSystem.colorSystem.emotions.neutral.background,
    borderRadius: 24,
    padding: 24,
    ...mentalWellnessDesignSystem.elementStyling.cards.activityCard.container.default.shadow,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: mentalWellnessDesignSystem.colorSystem.system.text.accent,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: mentalWellnessDesignSystem.colorSystem.system.text.accent,
    marginBottom: 8,
  },
  input: {
    backgroundColor: mentalWellnessDesignSystem.colorSystem.emotions.neutral.background,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: mentalWellnessDesignSystem.colorSystem.system.text.accent,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#2766E1',
    backgroundColor: mentalWellnessDesignSystem.colorSystem.system.background.light,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  otpSection: {
    marginTop: 4,
  },
  otpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sendOtpButton: {
    backgroundColor: '#2766E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendOtpText: {
    fontSize: 14,
    fontWeight: '600',
    color: mentalWellnessDesignSystem.colorSystem.system.text.onDark,
  },
  sentOtpText: {
    color: mentalWellnessDesignSystem.colorSystem.system.text.onDark,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: mentalWellnessDesignSystem.colorSystem.system.text.secondary,
    borderRadius: 8,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: mentalWellnessDesignSystem.colorSystem.emotions.happy.primary,
    borderColor: mentalWellnessDesignSystem.colorSystem.emotions.happy.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: mentalWellnessDesignSystem.colorSystem.system.text.secondary,
  },
  linkText: {
    color: '#2767E2',
    fontWeight: '600',
  },
  actionSection: {
    gap: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: mentalWellnessDesignSystem.elementStyling.buttons.primary.default.background,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 32,
    ...mentalWellnessDesignSystem.elementStyling.buttons.primary.default.shadow,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: mentalWellnessDesignSystem.elementStyling.buttons.primary.default.color,
    marginRight: 12,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: mentalWellnessDesignSystem.colorSystem.system.background.light,
    borderRadius: 16,
    paddingVertical: 16,
  },
  signInText: {
    fontSize: 16,
    color: mentalWellnessDesignSystem.colorSystem.system.text.secondary,
  },
  signInButton: {
    marginLeft: 8,
  },
  signInLink: {
    fontSize: 16,
    color: '#2767E2',
    fontWeight: '600',
  },
});

export default SignUpScreen; 