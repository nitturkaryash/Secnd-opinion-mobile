import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import { globalStyles, colors } from '../styles/globalStyles';
import mentalWellnessDesignSystem from '../../DesignSystem';
import AnimatedScreen from '../components/AnimatedScreen';
import { useNavigation } from '../context/NavigationContext';

interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'document';
  uri: string;
  size?: number;
}

const UploadDocsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { setDirection } = useNavigation();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [description, setDescription] = useState('');
  const [focusedField, setFocusedField] = useState<string>('');

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera and photo library permissions to upload documents.');
    }
  };

  const pickFromCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          name: `Camera_${Date.now()}.jpg`,
          type: 'image',
          uri: result.assets[0].uri,
        };
        setUploadedFiles(prev => [...prev, newFile]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image from camera');
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          name: result.assets[0].fileName || `Gallery_${Date.now()}.jpg`,
          type: result.assets[0].type === 'video' ? 'document' : 'image',
          uri: result.assets[0].uri,
        };
        setUploadedFiles(prev => [...prev, newFile]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          name: result.assets[0].name,
          type: 'document',
          uri: result.assets[0].uri,
          size: result.assets[0].size,
        };
        setUploadedFiles(prev => [...prev, newFile]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const showUploadOptions = () => {
    Alert.alert(
      'Upload Options',
      'Choose how you want to upload files',
      [
        { text: 'Camera', onPress: pickFromCamera },
        { text: 'Gallery', onPress: pickFromGallery },
        { text: 'Documents', onPress: pickDocument },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = () => {
    if (uploadedFiles.length === 0) {
      Alert.alert('Error', 'Please upload at least one document');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please describe your medical concern');
      return;
    }

    // Set direction for forward navigation
    setDirection(1);
    // @ts-ignore - navigation prop from tab navigator
    navigation.navigate('Schedule');
  };

  const formatFileSize = (size?: number) => {
    if (!size) return '';
    const kb = size / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const getInputStyle = (fieldName: string) => [
    styles.input,
    focusedField === fieldName && styles.inputFocused,
  ];

  const renderFileItem = ({ item }: { item: UploadedFile }) => (
    <View style={styles.fileItem}>
      <View style={styles.fileInfo}>
        <Ionicons 
          name={item.type === 'image' ? 'image' : 'document'} 
          size={24} 
          color="#2766E1"
        />
        <View style={styles.fileDetails}>
          <Text style={styles.fileName}>{item.name}</Text>
          {item.size && (
            <Text style={styles.fileSize}>{formatFileSize(item.size)}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFile(item.id)}
      >
        <Ionicons name="close-circle" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <AnimatedScreen direction={1} screenKey="Upload">
      <SafeAreaView style={[globalStyles.container, styles.container]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >


          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons 
                name="cloud-upload" 
                size={36} 
                color="#FFFFFF"
              />
            </View>
            <Text style={styles.title}>Upload Documents</Text>
            <Text style={styles.subtitle}>
              Upload your medical documents, reports, and images for expert review
            </Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Upload Section */}
            <View style={styles.uploadSection}>
              <View style={styles.uploadCard}>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={showUploadOptions}
                  activeOpacity={0.8}
                >
                  <View style={styles.uploadIcon}>
                    <Ionicons 
                      name="cloud-upload-outline" 
                      size={48} 
                      color="#2766E1"
                    />
                  </View>
                  <Text style={styles.uploadTitle}>Upload Files</Text>
                  <Text style={styles.uploadSubtitle}>
                    Tap to select files from your device
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* File List - Using FlatList with scrollEnabled={false} to avoid nesting warning */}
            {uploadedFiles.length > 0 && (
              <View style={styles.fileListCard}>
                <Text style={styles.cardHeader}>Uploaded Files ({uploadedFiles.length})</Text>
                <FlatList
                  data={uploadedFiles}
                  renderItem={renderFileItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => <View style={styles.fileSeparator} />}
                />
              </View>
            )}

            {/* Medical Concern Card */}
            <View style={styles.formCard}>
              <Text style={styles.cardHeader}>Medical Concern</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[getInputStyle('description'), styles.textArea]}
                  placeholder="Describe your medical concern and what second opinion you're seeking..."
                  placeholderTextColor={mentalWellnessDesignSystem.colorSystem.system.text.secondary}
                  value={description}
                  onChangeText={setDescription}
                  onFocus={() => setFocusedField('description')}
                  onBlur={() => setFocusedField('')}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <Text style={styles.characterCount}>
                  {description.length}/500 characters
                </Text>
              </View>
            </View>

            {/* Action Section */}
            <View style={styles.actionSection}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Continue to Scheduling</Text>
                <Ionicons 
                  name="arrow-forward" 
                  size={20} 
                  color="#FFFFFF"
                />
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
    backgroundColor: '#FFFFFF', // Pure white background
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
    paddingTop: 40,
    paddingBottom: 32,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2766E1', // Sky blue from design system
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#000000',
    paddingHorizontal: 20,
  },
  progressCard: {
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

  formContent: {
    gap: 24,
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
  uploadSection: {
    marginBottom: 24,
  },
  uploadCard: {
    backgroundColor: '#2766E1', // Sky blue for upload card
    borderRadius: 24,
    padding: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  uploadIcon: {
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  fileListCard: {
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
    color: '#000000',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#2766E1', // Sky blue for focus state
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  uploadButton: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.7,
  },
  supportedFormats: {
    alignItems: 'center',
  },
  supportedText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2766E1', // Sky blue for file icons
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  removeButton: {
    padding: 8,
  },
  fileSeparator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    marginVertical: 8,
  },
  textArea: {
    height: 120,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'right',
    marginTop: 8,
  },
  actionSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2766E1', // Sky blue for submit button
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 48,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    width: '100%',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 12,
  },

});

export default UploadDocsScreen; 