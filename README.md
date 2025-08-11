# SecondOpinion App

A React Native application for getting expert medical second opinions from top specialists worldwide.

## Features

- Multi-step onboarding flow
- Document upload functionality
- Appointment scheduling
- Progress tracking throughout the user journey

## Tech Stack & Architecture

### Core Technologies
- **React Native** with **TypeScript**
- **Expo** for development and deployment
- **React Navigation** for screen navigation
- **Expo Vector Icons** for iconography

### Design System
- Custom global styles (`globalStyles.ts`)
- Consistent color palette and typography
- Mobile-first responsive design
- Shadow and elevation effects for depth

### Component Architecture
- **AnimatedScreen**: Wrapper component for screen transitions
- **SafeAreaView**: Used for proper mobile layout
- **StyleSheet**: All styling uses React Native StyleSheet
- **TouchableOpacity**: Primary interaction component for buttons

### When Adding New Components

When integrating components from external sources, prioritize:

1. **TypeScript (.tsx)** - Best integration with existing codebase
2. **JavaScript (.jsx)** - Acceptable but loses type safety
3. **HTML/CSS** - Requires significant conversion

**Required Context for Component Integration:**
```
"React Native TypeScript app using:
- React Native components (View, Text, TouchableOpacity)
- StyleSheet for styling (not CSS)
- Expo vector icons
- Custom global styles and colors
- React Navigation with TypeScript
- Mobile-first responsive design
- SafeAreaView for layout"
```

## Components

### ProgressBar

A reusable progress indicator component that maintains consistent design across all screens.

**Usage:**
```tsx
import ProgressBar from './src/components/ProgressBar';

<ProgressBar currentStep={2} totalSteps={4} />
```

**Props:**
- `currentStep` (number): The current step in the flow (1-based)
- `totalSteps` (number): The total number of steps in the flow

**Design:**
- White rounded container with subtle shadow
- Centered step indicator text (e.g., "Step 2 of 4")
- Light gray progress track with blue fill
- Consistent styling across all screens

## Screens

1. **WelcomeScreen** - Step 1 of 4
2. **SignUpScreen** - Step 2 of 4  
3. **UploadDocsScreen** - Step 3 of 4
4. **DateSelectionScreen** - Step 4 of 4

Each screen includes the ProgressBar component at the top to show current progress through the multi-step flow.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS or Android:
```bash
npm run ios
# or
npm run android
``` 