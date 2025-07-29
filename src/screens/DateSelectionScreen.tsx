import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '../styles/globalStyles';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface AppointmentDetails {
  caseId: string;
  selectedDate: string;
  selectedTime: string;
  status: 'confirmed' | 'pending' | 'in-progress';
  timeline: Array<{
    step: string;
    status: 'completed' | 'current' | 'pending';
    date?: string;
  }>;
}

const DateSelectionScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isConfirmationView, setIsConfirmationView] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null);

  // Generate calendar dates for current month
  const generateCalendarDates = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const dates = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      dates.push({ date: '', disabled: true, key: `empty-${i}` });
    }
    
    // Add actual dates
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isDisabled = date < today || date.getDay() === 0; // Disable past dates and Sundays
      dates.push({
        date: i.toString(),
        disabled: isDisabled,
        key: `date-${i}`,
        fullDate: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`,
      });
    }
    
    return dates;
  };

  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00 AM', available: true },
    { id: '2', time: '10:00 AM', available: true },
    { id: '3', time: '11:00 AM', available: false },
    { id: '4', time: '02:00 PM', available: true },
    { id: '5', time: '03:00 PM', available: true },
    { id: '6', time: '04:00 PM', available: false },
    { id: '7', time: '05:00 PM', available: true },
  ];

  const handleDateSelect = (date: string, fullDate: string) => {
    setSelectedDate(fullDate);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Please select both date and time');
      return;
    }

    const caseId = `CASE-${Date.now().toString().slice(-6)}`;
    const details: AppointmentDetails = {
      caseId,
      selectedDate,
      selectedTime,
      status: 'confirmed',
      timeline: [
        { step: 'Documents Uploaded', status: 'completed', date: new Date().toISOString().split('T')[0] },
        { step: 'Appointment Scheduled', status: 'completed', date: new Date().toISOString().split('T')[0] },
        { step: 'Doctor Review', status: 'current' },
        { step: 'Consultation', status: 'pending' },
        { step: 'Report Delivery', status: 'pending' },
      ],
    };
    setAppointmentDetails(details);
    setIsConfirmationView(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderCalendarDate = ({ item }: { item: any }) => {
    if (!item.date) {
      return <View style={styles.emptyDate} />;
    }

    const isSelected = selectedDate === item.fullDate;
    
    return (
      <TouchableOpacity
        style={[
          styles.dateCell,
          item.disabled && styles.disabledDate,
          isSelected && styles.selectedDate,
        ]}
        onPress={() => !item.disabled && handleDateSelect(item.date, item.fullDate)}
        disabled={item.disabled}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.dateText,
            item.disabled && styles.disabledDateText,
            isSelected && styles.selectedDateText,
          ]}
        >
          {item.date}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTimeSlot = ({ item }: { item: TimeSlot }) => {
    const isSelected = selectedTime === item.time;
    
    return (
      <TouchableOpacity
        style={[
          styles.timeSlot,
          !item.available && styles.unavailableSlot,
          isSelected && styles.selectedTimeSlot,
        ]}
        onPress={() => item.available && handleTimeSelect(item.time)}
        disabled={!item.available}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.timeSlotText,
            !item.available && styles.unavailableSlotText,
            isSelected && styles.selectedTimeSlotText,
          ]}
        >
          {item.time}
        </Text>
        {!item.available && (
          <Text style={styles.unavailableLabel}>Booked</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderSelectionView = () => (
    <View style={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons 
            name="calendar" 
            size={32} 
            color="#FFFFFF"
          />
        </View>
        <Text style={styles.headerTitle}>Schedule Appointment</Text>
        <Text style={styles.headerSubtitle}>
          Choose your preferred date and time
        </Text>
      </View>

      <View style={styles.selectionContainer}>
        {/* Date Selection */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <View style={styles.calendarCard}>
            <Text style={styles.monthYear}>
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            
            <View style={styles.weekDays}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={styles.weekDay}>{day}</Text>
              ))}
            </View>
            
            <FlatList
              data={generateCalendarDates()}
              renderItem={renderCalendarDate}
              keyExtractor={(item) => item.key}
              numColumns={7}
              scrollEnabled={false}
              contentContainerStyle={styles.calendar}
            />
          </View>
        </View>

        {/* Time Selection */}
        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeSlotsCard}>
            <FlatList
              data={timeSlots}
              renderItem={renderTimeSlot}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.timeSlotsContainer}
            />
          </View>
        </View>

        {/* Selection Summary */}
        {(selectedDate || selectedTime) && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your Selection</Text>
            {selectedDate && (
              <Text style={styles.summaryText}>
                Date: {formatDate(selectedDate)}
              </Text>
            )}
            {selectedTime && (
              <Text style={styles.summaryText}>
                Time: {selectedTime}
              </Text>
            )}
          </View>
        )}

        {/* Confirm Button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedDate || !selectedTime) && styles.disabledButton
          ]}
          onPress={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
          <Ionicons name="arrow-forward" size={20} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConfirmationView = () => {
    if (!appointmentDetails) return null;
    
    return (
      <View style={styles.content}>
        <View style={styles.confirmationHeader}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#000000" />
          </View>
          <Text style={styles.confirmationTitle}>Appointment Confirmed!</Text>
          <Text style={styles.caseId}>Case ID: {appointmentDetails.caseId}</Text>
        </View>
        
        <View style={styles.appointmentDetailsContainer}>
          <Text style={styles.appointmentDetailsTitle}>Appointment Details</Text>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="calendar" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.detailText}>{formatDate(selectedDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="time" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.detailText}>{selectedTime}</Text>
          </View>
        </View>
        
        <View style={styles.timelineSection}>
          <Text style={styles.timelineTitle}>Progress Timeline</Text>
          <View>
            <View style={styles.timelineConnector} />
            {appointmentDetails.timeline.map((item, index) => {
              const isCompleted = item.status === 'completed';
              const isCurrent = item.status === 'current';
              const isLastItem = index === appointmentDetails.timeline.length - 1;

              // Determine the color of the connector based on the status of the current and next step
              const connectorColor = isCompleted ? '#2766E1' : '#E0E0E0';
              
              return (
                <View key={index} style={styles.timelineItem}>
                  {!isLastItem && (
                    <View style={[styles.timelineLine, { backgroundColor: connectorColor }]} />
                  )}
                  <View style={styles.timelineIcon}>
                    {isCompleted ? (
                      <View style={styles.completedStepIndicator}>
                        <Ionicons name="checkmark" size={18} color="#000000" />
                      </View>
                    ) : isCurrent ? (
                      <View style={styles.currentStepIndicator} />
                    ) : (
                      <View style={styles.pendingStepIndicator} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[
                      styles.timelineStep,
                      isCurrent && styles.currentTimelineStep,
                    ]}>
                      {item.step}
                    </Text>
                    {item.date && (
                      <Text style={styles.timelineDate}>{item.date}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.navigate('Welcome')}
          activeOpacity={0.8}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isConfirmationView ? renderSelectionView() : renderConfirmationView()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2766E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#666666',
    paddingHorizontal: 20,
  },
  selectionContainer: {
    gap: 24,
  },
  calendarSection: {
    flex: 1,
  },
  timeSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333333',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  calendar: {
    paddingBottom: 0,
  },
  emptyDate: {
    flex: 1,
    height: 48,
    margin: 3,
  },
  dateCell: {
    flex: 1,
    height: 48,
    margin: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#F8F8F8',
  },
  disabledDate: {
    opacity: 0.3,
  },
  selectedDate: {
    backgroundColor: '#2766E1',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  disabledDateText: {
    color: '#666666',
  },
  selectedDateText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timeSlotsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  timeSlotsContainer: {
    gap: 20, // Increased gap between rows
  },
  timeSlot: {
    flex: 1,
    marginHorizontal: 8, // Added horizontal margin for better spacing
    paddingVertical: 24, // Increased vertical padding for better touch target
    paddingHorizontal: 20, // Increased horizontal padding
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    backgroundColor: '#F8F8F8',
    minHeight: 80, // Minimum height for consistent sizing
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  unavailableSlot: {
    backgroundColor: '#F8F8F8',
    opacity: 0.7, // Slightly increased opacity for better visibility
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)', // Subtle border for visual distinction
  },
  selectedTimeSlot: {
    backgroundColor: '#2766E1',
    elevation: 4, // Increased elevation for selected state
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  timeSlotText: {
    fontSize: 18, // Increased font size for better readability
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center', // Ensure text is centered
    marginBottom: 4, // Space between time and status
  },
  unavailableSlotText: {
    color: '#999999', // Lighter color for unavailable slots
    textDecorationLine: 'line-through',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
    fontWeight: '700', // Bolder text for selected state
  },
  unavailableLabel: {
    fontSize: 13, // Slightly larger for better readability
    color: '#999999',
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 24,
    padding: 24,
    marginTop: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2766E1',
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 48,
    marginTop: 32, // Increased margin top
    marginBottom: 24, // Added margin bottom
    gap: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  confirmationHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  caseId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2766E1',
    marginBottom: 32, // Added margin to separate from details
  },
  // Appointment Details styles
  appointmentDetailsContainer: {
    backgroundColor: '#000000',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  appointmentDetailsTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  timelineSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  timelineTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 12,
    top: 24,
    width: 2,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  timelineIcon: {
    marginRight: 16,
    marginTop: 2,
    zIndex: 1,
  },
  currentStepIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2766E1',
  },
  pendingStepIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666666',
    opacity: 0.5,
  },
  completedStepIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2767E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineContent: {
    flex: 1,
  },
  timelineStep: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  currentTimelineStep: {
    color: '#000000',
    fontWeight: '600',
  },
  timelineDate: {
    fontSize: 14,
    color: '#000000',
    marginTop: 4,
  },
  doneButton: {
    backgroundColor: '#98e4fa',
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 48,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
});

export default DateSelectionScreen; 