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
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { globalStyles, colors } from '../styles/globalStyles';
import mentalWellnessDesignSystem from '../../DesignSystem';
import AnimatedScreen from '../components/AnimatedScreen';
import supabase from '../lib/supabase';
import { TablesInsert } from '../types/database.types';

interface ProfileData {
  fullName: string;
  age: string;
  gender: string;
  symptoms: string;
  profileImage: string | null;
}

const ProfileSetupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    age: '',
    gender: '',
    symptoms: '',
    profileImage: null,
  });
  
  const [focusedField, setFocusedField] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const updateProfileData = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const pickProfileImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera and photo library permissions to upload profile image.');
        return;
      }

      Alert.alert(
        'Select Profile Image',
        'Choose how you want to upload your profile picture',
        [
          { text: 'Camera', onPress: () => captureFromCamera() },
          { text: 'Gallery', onPress: () => pickFromGallery() },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to access image picker');
    }
  };

  const captureFromCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileData(prev => ({
          ...prev,
          profileImage: result.assets[0].uri,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image from camera');
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileData(prev => ({
          ...prev,
          profileImage: result.assets[0].uri,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const uploadProfileImage = async (imageUri: string, userId: string): Promise<string | null> => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const fileExt = imageUri.split('.').pop();
      const fileName = `${userId}/profile.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, blob, {
          contentType: blob.type,
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Failed to upload profile image: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return null;
    }
  };

  const handleSaveProfile = async () => {
    if (!profileData.fullName || !profileData.age || !profileData.gender) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Age, Gender)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let profileImageUrl: string | null = null;
      
      // Upload profile image if selected
      let devUserId: string;
      
      if (profileData.profileImage) {
        profileImageUrl = await uploadProfileImage(profileData.profileImage, 'temp-user');
      }

      // Create patient profile in the real database (let DB generate UUID)
      const patientData: TablesInsert<'patients'> = {
        name: profileData.fullName,
        age: parseInt(profileData.age) || null,
        gender: profileData.gender as any,
        symptoms: profileData.symptoms || null,
        avatar: profileImageUrl,
      };

      console.log('Creating patient profile in database...', patientData);

      // Actually insert the patient data and get the generated ID
      const { data: createdPatient, error: insertError } = await supabase
        .from('patients')
        .insert(patientData)
        .select('id')
        .single();

      if (insertError || !createdPatient) {
        throw new Error(`Failed to create patient profile: ${insertError?.message}`);
      }

      devUserId = createdPatient.id;

      // Store user ID in AsyncStorage for use in subsequent screens
      await AsyncStorage.setItem('currentUserId', devUserId);
      console.log('Patient profile created successfully with ID:', devUserId);

      Alert.alert('Success', 'Profile created successfully!', [
        { text: 'Continue', onPress: () => navigation.navigate('Upload') }
      ]);

    } catch (err: any) {
      console.error('Profile creation error:', err);
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (fieldName: string) => [
    styles.input,
    focusedField === fieldName && styles.inputFocused,
  ];

  return (
    <AnimatedScreen direction={1} screenKey="ProfileSetup">
      <SafeAreaView style={[globalStyles.container, styles.container]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Help us provide better healthcare services by completing your profile
            </Text>
          </View>

          <View style={styles.content}>
            {/* Profile Image Section */}
            <View style={styles.profileImageSection}>
              <TouchableOpacity style={styles.profileImageContainer} onPress={pickProfileImage}>
                {profileData.profileImage ? (
                  <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Ionicons name="person" size={48} color="#FFFFFF" />
                  </View>
                )}
                <View style={styles.cameraIcon}>
                  <Ionicons name="camera" size={20} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <Text style={styles.profileImageText}>Tap to add profile photo</Text>
            </View>

            {/* Personal Information Card */}
            <View style={styles.formCard}>
              <Text style={styles.cardHeader}>Personal Information</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={getInputStyle('fullName')}
                  placeholder="Enter your full name"
                  placeholderTextColor={mentalWellnessDesignSystem.colorSystem.system.text.secondary}
                  value={profileData.fullName}
                  onChangeText={(text) => updateProfileData('fullName', text)}
                  onFocus={() => setFocusedField('fullName')}
                  onBlur={() => setFocusedField('')}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Age *</Text>
                <TextInput
                  style={getInputStyle('age')}
                  placeholder="Enter your age"
                  placeholderTextColor={mentalWellnessDesignSystem.colorSystem.system.text.secondary}
                  value={profileData.age}
                  onChangeText={(text) => updateProfileData('age', text.replace(/[^0-9]/g, ''))}
                  onFocus={() => setFocusedField('age')}
                  onBlur={() => setFocusedField('')}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender *</Text>
                <View style={styles.genderContainer}>
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.genderOption,
                        profileData.gender === gender && styles.genderOptionSelected
                      ]}
                      onPress={() => updateProfileData('gender', gender)}
                    >
                      <Text style={[
                        styles.genderText,
                        profileData.gender === gender && styles.genderTextSelected
                      ]}>
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Medical Concerns / Symptoms</Text>
                <TextInput
                  style={[getInputStyle('symptoms'), styles.textArea]}
                  placeholder="Describe your symptoms or medical concerns..."
                  placeholderTextColor={mentalWellnessDesignSystem.colorSystem.system.text.secondary}
                  value={profileData.symptoms}
                  onChangeText={(text) => updateProfileData('symptoms', text)}
                  onFocus={() => setFocusedField('symptoms')}
                  onBlur={() => setFocusedField('')}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Action Section */}
            <View style={styles.actionSection}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.disabledButton]}
                onPress={handleSaveProfile}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Saving Profile...' : 'Continue'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 24,
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2766E1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileImageText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
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
  cardHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
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
  textArea: {
    height: 80,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  genderOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2766E1',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  genderTextSelected: {
    color: '#2766E1',
    fontWeight: '600',
  },
  actionSection: {
    gap: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2766E1',
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
    color: '#FFFFFF',
    marginRight: 12,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default ProfileSetupScreen;
