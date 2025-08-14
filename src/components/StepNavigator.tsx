import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StepLayout from './StepLayout';
import { useNavigation } from '../context/NavigationContext';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import UploadDocsScreen from '../screens/UploadDocsScreen';
import DateSelectionScreen from '../screens/DateSelectionScreen';
import SignInScreen from '../screens/SignInScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Create proper screen components to avoid inline function warnings
const WelcomeStepScreen: React.FC<any> = (props) => (
  <StepLayout currentStep={1} totalSteps={4}>
    <WelcomeScreen {...props} />
  </StepLayout>
);

const SignUpStepScreen: React.FC<any> = (props) => (
  <StepLayout currentStep={2} totalSteps={4}>
    <SignUpScreen {...props} />
  </StepLayout>
);

const UploadStepScreen: React.FC<any> = (props) => (
  <StepLayout currentStep={3} totalSteps={4}>
    <UploadDocsScreen {...props} />
  </StepLayout>
);

const ScheduleStepScreen: React.FC<any> = (props) => (
  <StepLayout currentStep={4} totalSteps={4}>
    <DateSelectionScreen {...props} />
  </StepLayout>
);

const ProfileStepScreen: React.FC<any> = (props) => (
  <StepLayout currentStep={0} totalSteps={4}>
    <ProfileScreen {...props} />
  </StepLayout>
);

// Stack Navigator for each tab
const WelcomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WelcomeMain" component={WelcomeStepScreen} />
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    <Stack.Screen name="Upload" component={UploadStepScreen} />
    <Stack.Screen name="Schedule" component={ScheduleStepScreen} />
  </Stack.Navigator>
);

const SignUpStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignUpMain" component={SignUpStepScreen} />
  </Stack.Navigator>
);

const UploadStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UploadMain" component={UploadStepScreen} />
  </Stack.Navigator>
);

const ProfileSetupStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileSetupMain" component={ProfileSetupScreen} />
  </Stack.Navigator>
);

const ScheduleStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ScheduleMain" component={ScheduleStepScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileStepScreen} />
  </Stack.Navigator>
);

const StepNavigator: React.FC = () => {
  const { setCurrentScreen } = useNavigation();

  return (
    <NavigationContainer
      onStateChange={(state) => {
        if (state?.routes && state.routes.length > 0) {
          const currentRoute = state.routes[state.index];
          if (currentRoute && currentRoute.name) {
            setCurrentScreen(currentRoute.name);
          }
        }
      }}
    >
      <StatusBar style="auto" />
      <Tab.Navigator
        initialRouteName="Welcome"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Welcome') {
              iconName = 'home';
            } else if (route.name === 'SignUp') {
              iconName = 'person-add';
            } else if (route.name === 'Upload') {
              iconName = 'cloud-upload';
            } else if (route.name === 'Schedule') {
              iconName = 'calendar';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            } else {
              iconName = 'home';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2766E1',
          tabBarInactiveTintColor: '#666666',
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E5E5',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Welcome" 
          component={WelcomeStack}
        />
        <Tab.Screen 
          name="SignUp" 
          component={SignUpStack}
        />
        <Tab.Screen 
          name="Upload" 
          component={UploadStack}
        />
        <Tab.Screen 
          name="Schedule" 
          component={ScheduleStack}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileStack}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default StepNavigator; 