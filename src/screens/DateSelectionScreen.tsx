import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '../styles/globalStyles';
import AnimatedScreen from '../components/AnimatedScreen';
import { useNavigation } from '../context/NavigationContext';


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
  const { setDirection } = useNavigation();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null);

  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      dates.push({
        id: i.toString(),
        date: date.getDate().toString(),
        fullDate: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: i === 0,
        isSelected: selectedDate === date.toISOString().split('T')[0],
      });
    }
    
    return dates;
  };

  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00 AM', available: true },
    { id: '2', time: '10:00 AM', available: true },
    { id: '3', time: '11:00 AM', available: true },
    { id: '4', time: '12:00 PM', available: false },
    { id: '5', time: '02:00 PM', available: true },
    { id: '6', time: '03:00 PM', available: true },
    { id: '7', time: '04:00 PM', available: true },
    { id: '8', time: '05:00 PM', available: true },
  ];

  const handleDateSelect = (date: string, fullDate: string) => {
    setSelectedDate(fullDate);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    // Generate a random case ID
    const caseId = `CASE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const details: AppointmentDetails = {
      caseId,
      selectedDate,
      selectedTime,
      status: 'confirmed',
      timeline: [
        { step: 'Account Created', status: 'completed', date: 'Today' },
        { step: 'Documents Uploaded', status: 'completed', date: 'Today' },
        { step: 'Appointment Scheduled', status: 'completed', date: 'Today' },
        { step: 'Doctor Review', status: 'current' },
        { step: 'Second Opinion Report', status: 'pending' },
        { step: 'Report Delivered', status: 'pending' },
      ],
    };

    setAppointmentDetails(details);
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

  const renderCalendarDate = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.calendarDate,
        item.isToday && styles.todayDate,
        item.isSelected && styles.selectedDate,
      ]}
      onPress={() => handleDateSelect(item.date, item.fullDate)}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.dateText,
        item.isToday && styles.todayText,
        item.isSelected && styles.selectedDateText,
      ]}>
        {item.date}
      </Text>
      <Text style={[
        styles.dayText,
        item.isToday && styles.todayText,
        item.isSelected && styles.selectedDateText,
      ]}>
        {item.day}
      </Text>
    </TouchableOpacity>
  );

  const renderTimeSlot = ({ item }: { item: TimeSlot }) => (
    <TouchableOpacity
      style={[
        styles.timeSlot,
        !item.available && styles.unavailableTimeSlot,
        selectedTime === item.time && styles.selectedTimeSlot,
      ]}
      onPress={() => item.available && handleTimeSelect(item.time)}
      disabled={!item.available}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.timeText,
        !item.available && styles.unavailableTimeText,
        selectedTime === item.time && styles.selectedTimeText,
      ]}>
        {item.time}
      </Text>
    </TouchableOpacity>
  );

  const renderSelectionView = () => (
    <View style={styles.content}>

      {/* Calendar Section */}
      <View style={styles.calendarCard}>
        <Text style={styles.cardHeader}>Select Date</Text>
        <FlatList
          data={generateCalendarDates()}
          renderItem={renderCalendarDate}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarContainer}
        />
      </View>

      {/* Time Slots Section */}
      <View style={styles.timeCard}>
        <Text style={styles.cardHeader}>Select Time</Text>
        <FlatList
          data={timeSlots}
          renderItem={renderTimeSlot}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.timeRow}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Confirmation Button */}
      <View style={styles.actionSection}>
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
                        <Ionicons name="checkmark" size={18} color="#FFFFFF" />
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
            onPress={() => {
              setDirection(-1);
              // @ts-ignore - navigation prop from tab navigator
              navigation.navigate('Welcome');
            }}
            activeOpacity={0.8}
          >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => (
    <View>

      {appointmentDetails ? renderConfirmationView() : renderSelectionView()}
    </View>
  );

  return (
    <AnimatedScreen direction={1} screenKey="Schedule">
      <SafeAreaView style={[globalStyles.container, styles.container]}>
        <FlatList
          data={[]}
          renderItem={() => null}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        />
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

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24, // Increased from 20 to 24 (8px grid)
    gap: 24, // Added consistent gap between sections (8px grid)
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
    marginBottom: 24, // Added consistent margin bottom (8px grid)
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
    color: '#FFFFFF',
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
    backgroundColor: '#2766E1',
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
    backgroundColor: '#2766E1',
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
    color: '#FFFFFF',
  },

  calendarContainer: {
    paddingHorizontal: 12, // Increased from 10 to 12 (4px grid)
    paddingVertical: 8, // Added vertical padding for better spacing
  },
  calendarDate: {
    width: 64, // Increased from 60 to 64 (8px grid)
    height: 80,
    marginHorizontal: 12, // Increased from 8 to 12 (4px grid)
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
  },
  todayDate: {
    backgroundColor: '#2766E1',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  dayText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  todayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectedDate: {
    backgroundColor: '#2766E1',
  },
  timeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32, // Increased from 24 to 32 (8px grid)
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
    marginBottom: 24, // Increased from 16 to 24 (8px grid)
  },
  timeRow: {
    justifyContent: 'space-between',
    marginBottom: 16, // Added 16px spacing between rows (8px grid)
  },
  timeSlot: {
    flex: 1,
    marginHorizontal: 12, // Increased from 8 to 12 (4px grid)
    paddingVertical: 20, // Reduced from 24 to 20 for better proportion
    paddingHorizontal: 16, // Reduced from 20 to 16 (4px grid)
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    minHeight: 72, // Reduced from 80 to 72 (8px grid)
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  unavailableTimeSlot: {
    backgroundColor: '#F8F8F8',
    opacity: 0.7,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  selectedTimeSlot: {
    backgroundColor: '#2766E1',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  timeText: {
    fontSize: 16, // Slightly reduced for better proportion
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 20, // Added line height for better readability
  },
  unavailableTimeText: {
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  selectedTimeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  actionSection: {
    marginTop: 40, // Increased from 32 to 40 (8px grid)
    paddingHorizontal: 8, // Added horizontal padding for better alignment
  },
  progressContainer: {
    marginBottom: 24,
  },
});

export default DateSelectionScreen; 