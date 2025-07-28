# Demo Instructions - SecondOpinion Healthcare App

## How to Test All Features

### 1. Welcome Screen
- **Service Cards**: Tap both "Self-Service" and "Assisted Help" cards (currently just logs to console)
- **Trust Badges**: View HIPAA Compliant, 24/7 Support, Expert Doctors badges
- **Navigation**: Tap "Get Started" button → navigates to Sign Up tab

### 2. Sign-Up Screen
- **Form Fields**: Fill all required fields:
  - Email/Phone: Enter any email or 10-digit phone
  - Password: Enter any password (tap eye icon to show/hide)
  - Confirm Password: Must match password field
  - Aadhaar: Enter 12-digit number (auto-formats)
  - OTP: Tap "Send OTP" first, then enter any 6-digit code
- **Terms Checkbox**: Must check to proceed
- **Validation**: Try submitting with missing fields to see error alerts
- **Success**: Complete form → navigates to Upload Documents tab

### 3. Upload Documents Screen
- **Progress Bar**: Shows "Step 3 of 4" 
- **Aadhaar Input**: Enter 12-digit number (numeric only)
- **Document Upload**: Tap dashed upload area → choose from:
  - Camera: Take new photo
  - Gallery: Select from photo library
  - Files: Pick PDF or image files
- **File Management**: View uploaded files, tap X to remove
- **Description**: Enter medical concern (shows character count)
- **Validation**: Try submitting without required fields
- **Success**: Complete form → navigates to Schedule tab

### 4. Date Selection Screen
- **Step Indicator**: 3-step process (Date → Time → Confirm)
- **Calendar**: 
  - Tap any future date (past dates and Sundays disabled)
  - Selected date highlighted in green
- **Time Slots**: 
  - Available slots clickable, unavailable shown as "Booked"
  - Select any green time slot
- **Back Navigation**: Use "Back to Date" if needed
- **Confirmation**: 
  - Shows generated Case ID
  - Displays appointment details with icons
  - Timeline shows progress steps
  - Tap "Done" → returns to Welcome screen

### 5. Bottom Tab Navigation
- **Tab Icons**: home, person, upload, calendar
- **Active State**: Green color (#7ED321) when selected
- **No Labels**: Clean icon-only design
- **Shadow**: Subtle elevation effect
- **Switch Freely**: Tap any tab to jump between screens

## Testing Tips

### Valid Test Data
- **Email**: test@example.com
- **Phone**: 9876543210
- **Password**: password123
- **Aadhaar**: 123456789012
- **OTP**: 123456 (after tapping "Send OTP")

### Error Testing
- Leave required fields empty
- Mismatched passwords
- Submit without OTP verification
- Try uploading without documents

### Navigation Flow
1. Welcome → Sign Up (via Get Started button)
2. Sign Up → Upload (via form submission)
3. Upload → Schedule (via form submission)
4. Schedule → Welcome (via Done button)
5. Use bottom tabs to jump between any screen

## Visual Features to Notice

- **Design System**: Consistent spacing, colors, typography
- **Green Accent**: #7ED321 for active states and primary actions
- **Shadows**: Subtle depth on cards and buttons
- **Focus States**: Input fields highlight when selected
- **Animations**: Smooth tab transitions and button presses
- **Icons**: Ionicons throughout for consistency
- **Form States**: Visual feedback for validation and interactions

---

The app demonstrates a complete healthcare MVP workflow with professional UI/UX patterns! 