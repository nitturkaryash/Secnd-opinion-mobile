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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '../styles/globalStyles';
import mentalWellnessDesignSystem from '../../DesignSystem';
import AnimatedScreen from '../components/AnimatedScreen';
import supabase from '../lib/supabase';

const BYPASS_EMAIL = 'pankajhadole4@gmail.com';
const BYPASS_PASSWORD = 'admin123';

const SignInScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [focusedField, setFocusedField] = useState<string>('');

  const handleQuickSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Development bypass: Skipping authentication...');
      
      // Development bypass - skip all authentication
      setTimeout(async () => {
        console.log('Bypass successful!');
        
        // Check if user already has a profile
        const existingUserId = await AsyncStorage.getItem('currentUserId');
        if (existingUserId) {
          // Check if profile exists in database
          const { data: existingProfile } = await supabase
            .from('patients')
            .select('id')
            .eq('id', existingUserId)
            .single();
            
          if (existingProfile) {
            console.log('Existing profile found, navigating to Upload');
            Alert.alert('Success', 'Welcome back! Signed in successfully!');
            navigation.navigate('Upload');
            setLoading(false);
            return;
          }
        }
        
        // No existing profile, go to profile setup
        Alert.alert('Success', 'Development bypass - Signed in successfully!');
        navigation.navigate('ProfileSetup');
        setLoading(false);
      }, 1000); // Small delay to show loading state
      
    } catch (err: any) {
      console.log('Unexpected error:', err);
      setError(err.message);
      Alert.alert('Error', err.message);
      setLoading(false);
    }
  };

  const handleManualSignIn = async () => {
    // Development bypass - any email/password will work
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Development bypass: Manual sign in with any credentials...');
      
      // Development bypass - skip authentication for any email/password
      setTimeout(async () => {
        console.log('Manual bypass successful!');
        
        // Check if user already has a profile
        const existingUserId = await AsyncStorage.getItem('currentUserId');
        if (existingUserId) {
          // Check if profile exists in database
          const { data: existingProfile } = await supabase
            .from('patients')
            .select('id')
            .eq('id', existingUserId)
            .single();
            
          if (existingProfile) {
            console.log('Existing profile found, navigating to Upload');
            Alert.alert('Success', `Welcome back ${email}!`);
            navigation.navigate('Upload');
            setLoading(false);
            return;
          }
        }
        
        // No existing profile, go to profile setup
        Alert.alert('Success', `Development bypass - Signed in as ${email}!`);
        navigation.navigate('ProfileSetup');
        setLoading(false);
      }, 1000); // Small delay to show loading state
      
    } catch (err: any) {
      setError(err.message);
      Alert.alert('Error', err.message);
      setLoading(false);
    }
  };

  const getInputStyle = (fieldName: string) => [
    styles.input,
    focusedField === fieldName && styles.inputFocused,
  ];

  return (
    <AnimatedScreen direction={1} screenKey="SignIn">
      <SafeAreaView style={[globalStyles.container, styles.container]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.title}>Sign In</Text>
          </View>

          <View style={styles.content}>
            {/* Bypass Button */}
            <TouchableOpacity
              style={[styles.bypassButton, loading && styles.disabledButton]}
              onPress={handleQuickSignIn}
              disabled={loading}
            >
              <Text style={styles.bypassButtonText}>
                {loading ? 'Bypassing...' : 'Dev Bypass Login'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.orText}>- OR -</Text>

            {/* Regular Sign In Form */}
            <View style={styles.formCard}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={getInputStyle('email')}
                  placeholder="Enter your email"
                  placeholderTextColor={mentalWellnessDesignSystem.colorSystem.system.text.secondary}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField('email')}
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
                    value={password}
                    onChangeText={setPassword}
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
            </View>

            <View style={styles.actionSection}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.disabledButton]}
                onPress={handleManualSignIn}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
                <Ionicons name="log-in-outline" size={20} color="#2766E1" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222222',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 24,
  },
  bypassButton: {
    backgroundColor: '#2766E1',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  bypassButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
    marginVertical: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#2766E1',
    backgroundColor: '#FFFFFF',
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
  actionSection: {
    gap: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginRight: 12,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default SignInScreen;