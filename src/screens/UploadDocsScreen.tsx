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
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { globalStyles, colors } from '../styles/globalStyles';
import mentalWellnessDesignSystem from '../../DesignSystem';

interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'document';
  uri: string;
  size?: number;
}

const UploadDocsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [focusedField, setFocusedField] = useState<string>('');

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera roll permissions are needed to upload images.');
      return false;
    }
    return true;
  };

  const pickFromCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: `Camera_${Date.now()}.jpg`,
        type: 'image',
        uri: result.assets[0].uri,
      };
      setUploadedFiles(prev => [...prev, newFile]);
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newFiles: UploadedFile[] = result.assets.map((asset, index) => ({
        id: `${Date.now()}_${index}`,
        name: asset.fileName || `Image_${Date.now()}_${index}.jpg`,
        type: 'image' as const,
        uri: asset.uri,
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: true,
      });

      if (!result.canceled) {
        const newFiles: UploadedFile[] = result.assets.map((asset, index) => ({
          id: `${Date.now()}_${index}`,
          name: asset.name,
          type: asset.mimeType?.startsWith('image/') ? 'image' : 'document',
          uri: asset.uri,
          size: asset.size,
        }));
        setUploadedFiles(prev => [...prev, ...newFiles]);
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
      'Choose how you want to upload your documents',
      [
        { text: 'Camera', onPress: pickFromCamera },
        { text: 'Gallery', onPress: pickFromGallery },
        { text: 'Files', onPress: pickDocument },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = () => {
    if (!aadhaarNumber) {
      Alert.alert('Error', 'Please enter your Aadhaar number');
      return;
    }

    if (uploadedFiles.length === 0) {
      Alert.alert('Error', 'Please upload at least one document');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description of your medical concern');
      return;
    }

    navigation.navigate('Schedule');
  };

  const formatFileSize = (size?: number) => {
    if (!size) return '';
    const mb = size / (1024 * 1024);
    return mb > 1 ? `${mb.toFixed(1)}MB` : `${(size / 1024).toFixed(0)}KB`;
  };

  const getInputStyle = (fieldName: string) => [
    styles.input,
    focusedField === fieldName && styles.inputFocused,
  ];

  const renderFileItem = ({ item }: { item: UploadedFile }) => (
    <View style={styles.fileItem}>
      <View style={styles.fileInfo}>
        <View style={styles.fileIconContainer}>
          <Ionicons
            name={item.type === 'image' ? 'image' : 'document'}
            size={24}
            color={mentalWellnessDesignSystem.colorSystem.system.text.onDark}
          />
        </View>
        <View style={styles.fileDetails}>
          <Text style={styles.fileName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.size && (
            <Text style={styles.fileSize}>{formatFileSize(item.size)}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFile(item.id)}
      >
        <Ionicons name="close-circle" size={24} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons 
                name="cloud-upload" 
                size={32} 
                color={mentalWellnessDesignSystem.colorSystem.system.text.onDark}
              />
            </View>
            <Text style={styles.title}>Upload Documents</Text>
            <Text style={styles.subtitle}>
              Upload your medical reports, prescriptions, and relevant documents
            </Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressCard}>
            <Text style={styles.progressLabel}>Step 3 of 4</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '75%' }]} />
            </View>
          </View>

          {/* Form Content */}
          <View style={styles.formContent}>
            {/* Patient Information Card */}
            <View style={styles.formCard}>
              <Text style={styles.cardHeader}>Patient Information</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Aadhaar Number</Text>
                <TextInput
                  style={getInputStyle('aadhaar')}
                  placeholder="Enter your 12-digit Aadhaar number"
                  placeholderTextColor={mentalWellnessDesignSystem.colorSystem.system.text.secondary}
                  value={aadhaarNumber}
                  onChangeText={(text) => setAadhaarNumber(text.replace(/\D/g, '').slice(0, 12))}
                  onFocus={() => setFocusedField('aadhaar')}
                  onBlur={() => setFocusedField('')}
                  keyboardType="numeric"
                  maxLength={12}
                />
              </View>
            </View>

            {/* Document Upload Card */}
            <View style={styles.uploadCard}>
              <Text style={styles.cardHeader}>Medical Documents</Text>
              
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={showUploadOptions}
                activeOpacity={0.8}
              >
                <View style={styles.uploadIconContainer}>
                  <Ionicons name="cloud-upload-outline" size={48} color={mentalWellnessDesignSystem.colorSystem.system.text.onDark} />
                </View>
                <Text style={styles.uploadButtonText}>Upload Documents</Text>
                <Text style={styles.uploadSubtext}>
                  Tap to select from camera, gallery, or files
                </Text>
              </TouchableOpacity>

              <View style={styles.supportedFormats}>
                <Text style={styles.supportedText}>
                  📄 Supported formats: JPEG, PNG, PDF
                </Text>
              </View>
            </View>

            {/* File List Card */}
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
                  color={mentalWellnessDesignSystem.elementStyling.buttons.primary.default.color}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF', // Pure white background
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
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
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#666666',
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
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
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
    color: '#333333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
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
    color: '#000000',
    marginBottom: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    opacity: 0.7,
  },
  supportedFormats: {
    alignItems: 'center',
  },
  supportedText: {
    fontSize: 14,
    color: '#000000',
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
    color: '#333333',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: '#666666',
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
    color: '#666666',
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
    color: '#000000',
    marginRight: 12,
  },
});

export default UploadDocsScreen; 