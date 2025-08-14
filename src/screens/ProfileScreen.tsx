import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { globalStyles, colors } from '../styles/globalStyles';
import mentalWellnessDesignSystem from '../../DesignSystem';
import AnimatedScreen from '../components/AnimatedScreen';
import supabase from '../lib/supabase';
import { TablesUpdate } from '../types/database.types';

interface ProfileData {
  id: string;
  fullName: string;
  age: string;
  gender: string;
  symptoms: string;
  profileImage: string | null;
}

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    id: '',
    fullName: '',
    age: '',
    gender: '',
    symptoms: '',
    profileImage: null,
  });
  
  const [focusedField, setFocusedField] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  // Validate profile data after loading
  useEffect(() => {
    if (!initialLoading && profileData.id === '') {
      console.warn('Profile ID is empty after loading, attempting to reload...');
      loadProfile();
    }
  }, [initialLoading, profileData.id]);

  const loadProfile = async () => {
    try {
      setInitialLoading(true);
      const currentUserId = await AsyncStorage.getItem('currentUserId');
      
      console.log('AsyncStorage currentUserId:', currentUserId);
      
      if (!currentUserId) {
        Alert.alert('Error', 'No user session found. Please sign in again.');
        navigation.navigate('SignIn');
        return;
      }

      console.log('Loading profile for user:', currentUserId);

      const { data: profile, error: fetchError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', currentUserId)
        .single();

      if (fetchError) {
        console.error('Error loading profile:', fetchError);
        console.error('Error details:', {
          code: fetchError.code,
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint
        });
        
        if (fetchError.code === 'PGRST116') {
          // Profile not found, create a new one
          Alert.alert(
            'Profile Not Found', 
            'Your profile was not found. Please complete your profile setup.',
            [
              {
                text: 'Go to Profile Setup',
                onPress: () => navigation.navigate('ProfileSetup')
              },
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => navigation.goBack()
              }
            ]
          );
        } else {
          setError(`Failed to load profile: ${fetchError.message}`);
        }
        return;
      }

      if (profile) {
        console.log('Profile data received:', profile);
        setProfileData({
          id: profile.id,
          fullName: profile.name || '',
          age: profile.age?.toString() || '',
          gender: profile.gender || '',
          symptoms: profile.symptoms || '',
          profileImage: profile.avatar || null,
        });
        console.log('Profile loaded successfully:', profile.id);
      } else {
        console.log('No profile data received');
        setError('No profile data received');
      }
    } catch (err: any) {
      console.error('Profile loading error:', err);
      setError(err.message);
    } finally {
      setInitialLoading(false);
    }
  };

  const updateProfileData = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const pickProfileImage = async () => {
    try {
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
      // Ensure we have a valid user id to update
      const userIdFromStorage = await AsyncStorage.getItem('currentUserId');
      const userId = profileData.id || userIdFromStorage;
      
      if (!userId) {
        Alert.alert('Error', 'User session not found. Please sign in again.');
        setLoading(false);
        return;
      }

      console.log('Profile update - User ID:', userId);
      console.log('Profile update - Profile Data ID:', profileData.id);

      // Backfill id into local state if it was missing
      if (!profileData.id) {
        setProfileData(prev => ({ ...prev, id: userId }));
        console.log('Backfilled profile ID:', userId);
      }

      let profileImageUrl = profileData.profileImage;
      
      // Upload new profile image if it's a local URI (starts with file://)
      if (profileData.profileImage && profileData.profileImage.startsWith('file://')) {
        console.log('Uploading profile image for user:', userId);
        profileImageUrl = await uploadProfileImage(profileData.profileImage, userId);
        if (!profileImageUrl) {
          console.warn('Failed to upload profile image, using existing URL');
        }
      }

      // Update patient profile in the database
      const updateData: TablesUpdate<'patients'> = {
        name: profileData.fullName,
        age: parseInt(profileData.age) || null,
        gender: profileData.gender as any,
        symptoms: profileData.symptoms || null,
        avatar: profileImageUrl,
      };

      console.log('Updating patient profile...', { id: userId, ...updateData });

      const { error: updateError } = await supabase
        .from('patients')
        .update(updateData)
        .eq('id', userId);

      if (updateError) {
        console.error('Supabase update error:', updateError);
        throw new Error(`Failed to update patient profile: ${updateError.message}`);
      }

      console.log('Profile updated successfully');
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');

      // Reload the profile to get the latest data
      await loadProfile();

    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('currentUserId');
            navigation.navigate('WelcomeMain');
          }
        }
      ]
    );
  };

  const debugProfileState = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem('currentUserId');
      console.log('=== DEBUG PROFILE STATE ===');
      console.log('AsyncStorage currentUserId:', currentUserId);
      console.log('Local profileData.id:', profileData.id);
      console.log('Full profileData:', profileData);
      
      if (currentUserId) {
        const { data: profile, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', currentUserId)
          .single();
        
        console.log('Database profile:', profile);
        console.log('Database error:', error);
      }
      console.log('=== END DEBUG ===');
    } catch (err) {
      console.error('Debug error:', err);
    }
  };

  const getInputStyle = (fieldName: string) => [
    styles.input,
    focusedField === fieldName && styles.inputFocused,
    !isEditing && styles.inputDisabled,
  ];

  if (initialLoading) {
    return (
      <AnimatedScreen direction={1} screenKey="Profile">
        <SafeAreaView style={[globalStyles.container, styles.container]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading Profile...</Text>
          </View>
        </SafeAreaView>
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen direction={1} screenKey="Profile">
      <SafeAreaView style={[globalStyles.container, styles.container]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>My Profile</Text>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setIsEditing(!isEditing)}
            >
              <Ionicons 
                name={isEditing ? "close" : "pencil"} 
                size={20} 
                color="#FFFFFF" 
              />
              <Text style={styles.editButtonText}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Profile Image Section */}
            <View style={styles.profileImageSection}>
              <TouchableOpacity 
                style={styles.profileImageContainer} 
                onPress={isEditing ? pickProfileImage : undefined}
                disabled={!isEditing}
              >
                {profileData.profileImage ? (
                  <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Ionicons name="person" size={48} color="#FFFFFF" />
                  </View>
                )}
                {isEditing && (
                  <View style={styles.cameraIcon}>
                    <Ionicons name="camera" size={20} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
              <Text style={styles.profileImageText}>
                {isEditing ? 'Tap to change profile photo' : 'Profile Photo'}
              </Text>
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
                  editable={isEditing}
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
                  editable={isEditing}
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
                        profileData.gender === gender && styles.genderOptionSelected,
                        !isEditing && styles.genderOptionDisabled
                      ]}
                      onPress={() => isEditing && updateProfileData('gender', gender)}
                      disabled={!isEditing}
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
                  editable={isEditing}
                />
              </View>
            </View>

            {/* Action Section */}
            <View style={styles.actionSection}>
              {isEditing && (
                <>
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                  <TouchableOpacity
                    style={[styles.submitButton, loading && styles.disabledButton]}
                    onPress={handleSaveProfile}
                    disabled={loading}
                  >
                    <Text style={styles.submitButtonText}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Text>
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </>
              )}
              
              {!isEditing && (
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out" size={20} color="#FF3B30" />
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222222',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2766E1',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
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
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
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
  genderOptionDisabled: {
    backgroundColor: '#F5F5F5',
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
});

export default ProfileScreen;
