# Animated Progress Bar Setup Guide

This guide explains how to set up the fixed, animated progress bar system for your React Native step-by-step flow.

## ✅ **Dependencies Installed**

The following packages have been installed:

```bash
npm install @react-navigation/stack react-native-reanimated react-native-gesture-handler --legacy-peer-deps
```

## 📦 **Required Dependencies**

```json
{
  "@react-navigation/stack": "^7.4.4",
  "react-native-reanimated": "^3.0.0",
  "react-native-gesture-handler": "^2.0.0"
}
```

## 🔧 **Additional Setup Required**

### 1. Babel Configuration

Add the Reanimated plugin to your `babel.config.js`:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Add this line
    ],
  };
};
```

### 2. Metro Configuration (if needed)

Create or update `metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

### 3. App Entry Point

Update your `App.tsx` to use the new StepNavigator:

```tsx
import React from 'react';
import { NavigationProvider } from './src/context/NavigationContext';
import StepNavigator from './src/components/StepNavigator';

const App: React.FC = () => {
  return (
    <NavigationProvider>
      <StepNavigator />
    </NavigationProvider>
  );
};

export default App;
```

## 🎯 **Key Components Created**

### 1. **ProgressBar Component** (`src/components/ProgressBar.tsx`)

- **Animated progress fill** using react-native-reanimated
- **Smooth transitions** when step changes
- **Text fade animations** during progress updates
- **Exact design match** to your screenshots

**Usage:**
```tsx
<ProgressBar currentStep={2} totalSteps={4} animated={true} />
```

### 2. **StepLayout Component** (`src/components/StepLayout.tsx`)

- **Fixed progress bar position** at the top of every screen
- **Screen transition animations** (slide + fade)
- **Consistent spacing** and layout across all steps
- **Safe area handling** for different devices

**Usage:**
```tsx
<StepLayout currentStep={2} totalSteps={4} direction="forward">
  <YourScreenContent />
</StepLayout>
```

### 3. **StepNavigator Component** (`src/components/StepNavigator.tsx`)

- **Stack navigation** with smooth transitions
- **Gesture support** for swipe back
- **Custom transition animations**
- **Automatic progress bar integration**

## 🎨 **Design Specifications**

The progress bar maintains the exact design from your screenshots:

- **Container**: White background, 20px border radius, subtle shadow
- **Text**: "Step X of Y" centered, 14px font, 600 weight, black color
- **Progress Bar**: Light gray track (#F0F0F0), blue fill (#2766E1)
- **Spacing**: 20px padding, 32px bottom margin, 12px text-bar gap
- **Dimensions**: 8px height for progress bar

## 🚀 **Navigation Flow**

1. **Welcome** → **SignUp** → **Upload** → **Schedule**
2. **Smooth slide transitions** between screens
3. **Progress bar animates** to new step position
4. **Gesture support** for going back

## 📱 **Screen Updates**

All screens have been updated to:
- Remove individual progress bars
- Use consistent navigation calls
- Work with the new StepLayout wrapper

## 🔄 **Animation Details**

### Progress Bar Animations:
- **Duration**: 600ms for progress fill
- **Easing**: Bezier curve for smooth motion
- **Text fade**: 150ms fade out/in during updates

### Screen Transitions:
- **Duration**: 300ms for slide + fade
- **Direction**: Forward (right to left), Backward (left to right)
- **Gesture**: Horizontal swipe to go back

## 🛠 **Troubleshooting**

### If animations don't work:
1. Restart the Metro bundler: `npm start -- --clear`
2. Clear cache: `npx expo start --clear`
3. Rebuild: `npx expo run:ios` or `npx expo run:android`

### If navigation doesn't work:
1. Check that all navigation calls use the correct screen names:
   - `navigation.navigate('SignUp')`
   - `navigation.navigate('Upload')`
   - `navigation.navigate('Schedule')`

## ✅ **Verification**

To verify everything is working:

1. **Progress bar position**: Should be fixed at the top of every screen
2. **Animations**: Progress fill should animate smoothly between steps
3. **Transitions**: Screens should slide and fade when navigating
4. **Design**: Should match your screenshots exactly

## 🎯 **Next Steps**

1. Test the app on both iOS and Android
2. Verify all navigation flows work correctly
3. Check that the progress bar stays in the exact same position
4. Confirm animations are smooth and consistent

The system is now ready to provide a professional, animated step-by-step experience with a fixed progress bar that never moves position! 