import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import WelcomeScreen from './src/screens/WelcomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import UploadDocsScreen from './src/screens/UploadDocsScreen';
import DateSelectionScreen from './src/screens/DateSelectionScreen';
import { colors } from './src/styles/globalStyles';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        initialRouteName="Sign Up"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Welcome') {
              iconName = 'home';
            } else if (route.name === 'Sign Up') {
              iconName = 'person';
            } else if (route.name === 'Upload') {
              iconName = 'cloud-upload';
            } else if (route.name === 'Schedule') {
              iconName = 'calendar';
            } else {
              iconName = 'home';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.activeTab,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
          },
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            color: colors.textPrimary,
          },
        })}
      >
        <Tab.Screen 
          name="Sign Up" 
          component={SignUpScreen}
          options={{ 
            title: 'Sign Up',
            tabBarButton: () => null, // This hides the Sign Up tab from the tab bar
          }}
        />
        <Tab.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Upload" 
          component={UploadDocsScreen}
          options={{ title: 'Upload Documents' }}
        />
        <Tab.Screen 
          name="Schedule" 
          component={DateSelectionScreen}
          options={{ title: 'Schedule Appointment' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App; 