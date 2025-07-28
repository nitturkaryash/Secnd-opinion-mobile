# SecondOpinion Healthcare App

A React Native MVP app for getting second medical opinions, built with Expo and TypeScript.

## Features

### 4-Screen Navigation Flow
- **Welcome Screen**: Service selection with trust badges and navigation
- **Sign-Up Screen**: Complete user registration with OTP verification
- **Upload Documents Screen**: Medical document upload with progress tracking
- **Date Selection Screen**: Appointment scheduling with calendar and confirmation

### Key Functionality
- Clean bottom tab navigation with icons (no labels)
- Document upload (camera, gallery, files)
- Interactive calendar with date/time selection
- Progress tracking and confirmation system
- Form validation and OTP verification
- Responsive design following healthcare UI best practices

## Tech Stack

- **React Native** with **Expo SDK 50**
- **TypeScript** for type safety
- **React Navigation 6** for bottom tabs
- **Expo Image Picker** for document uploads
- **Ionicons** for icons
- Custom design system integration

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd secnd_new\ design_bento
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run start
   ```
   Or use the memory-specific command:
   ```bash
   bun run start
   ```

3. **Run on devices**:
   - iOS: `npm run ios` or press `i` in terminal
   - Android: `npm run android` or press `a` in terminal  
   - Web: `npm run web` or press `w` in terminal

## Project Structure

```
secnd_new design_bento/
├── src/
│   ├── screens/
│   │   ├── WelcomeScreen.tsx      # Landing page with service cards
│   │   ├── SignUpScreen.tsx       # User registration form
│   │   ├── UploadDocsScreen.tsx   # Document upload interface
│   │   └── DateSelectionScreen.tsx # Appointment scheduling
│   └── styles/
│       └── globalStyles.ts        # Shared styles and theme
├── App.tsx                        # Main navigation component
├── DesignSystem.ts               # Comprehensive design system
└── package.json                  # Dependencies and scripts
```

## App Flow

1. **Welcome** → Shows service options, trust badges, navigation to sign-up
2. **Sign-Up** → Registration form with email/phone, password, Aadhaar, OTP
3. **Upload** → Document upload via camera/gallery/files with progress indicator
4. **Schedule** → Calendar date selection → time slots → confirmation with case tracking

## Design System

The app uses a comprehensive design system (`DesignSystem.ts`) with:
- Healthcare-appropriate color palette
- Typography hierarchy (Space Grotesk + SF Pro)
- Consistent spacing and component styles
- Accessibility considerations
- Light mode optimization (white backgrounds, black logos)

## Key Components

### Bottom Tab Navigation
- White background with subtle shadow
- Green active state (#7ED321)
- Icons: home, person, upload, calendar
- No labels for clean appearance

### Form Components
- Consistent input styling with focus states
- Validation and error handling
- OTP verification workflow
- File upload with preview

### Calendar & Scheduling
- Monthly calendar grid view
- Time slot selection with availability
- Multi-step process (Date → Time → Confirmation)
- Case ID generation and progress tracking

## Available Scripts

- `start` - Start development server
- `android` - Run on Android device/emulator
- `ios` - Run on iOS device/simulator
- `web` - Run on web browser
- `lint` - Run ESLint

## Configuration

- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting configured
- **Babel**: Expo preset configured
- **Navigation**: Bottom tabs with custom styling

## Healthcare Compliance Notes

- Form validation for medical data
- Aadhaar number input formatting
- Document upload with file type validation
- Progress tracking for transparency
- Trust badges highlighting HIPAA compliance

---

**Built for healthcare professionals and patients seeking reliable second medical opinions.** 