# Patient Page Restructure - Complete Changes

## Summary of Changes

### ✅ 1. Removed VC Section After Create DID
- The Verifiable Credential section no longer appears immediately after creating a DID
- VC generation is now only available after submitting a policy request

### ✅ 2. VC Generation After Policy Request
- The VC section now appears **only after** a policy request has been successfully submitted
- This creates a logical flow: Create DID → Request Policy → Generate VC
- The section is controlled by `showVCSection` state variable

### ✅ 3. Policy Request Status Section
- Added a new "Policy Request Status" card that displays all submitted policy requests
- Shows request details including:
  - Request ID
  - Submission date/time
  - Status (pending, approved, rejected) with color-coded badges
  - Coverage amount
  - Patient address
  - Additional details (if provided)
- Automatically refreshes every 5 seconds to show updated status
- Only displays requests that match the current patient's DID or wallet address

### ✅ 4. MetaMask Disconnect Popup
- Added a modal popup that appears when MetaMask wallet gets disconnected
- Popup includes:
  - Warning icon and message
  - Explanation that wallet was disconnected
  - "Reconnect Wallet" button to quickly reconnect
  - "Dismiss" button to close the popup
- Monitors wallet state changes using `useEffect` hook
- Detects when wallet goes from connected to disconnected state

## New Flow

1. **Create DID** - User creates their decentralized identity
2. **Request Policy** - User submits a policy request with coverage amount and details
3. **View Status** - User can see the status of their submitted requests
4. **Generate VC** - After submitting a policy request, user can generate verifiable credentials
5. **Disconnect Alert** - If MetaMask disconnects, user gets a popup notification

## Technical Details

### New State Variables
- `policyRequests` - Array of policy requests for the current patient
- `showVCSection` - Boolean to control VC section visibility
- `showDisconnectPopup` - Boolean to control disconnect popup visibility
- `prevWalletState` - Previous wallet state for comparison

### New Functions
- `loadPolicyRequests()` - Fetches and filters policy requests for current patient
- Enhanced `handleRequestPolicy()` - Now sets `showVCSection` to true after successful submission

### New useEffect Hooks
- Wallet disconnection monitoring
- Policy requests auto-refresh (every 5 seconds)

### ConnectWallet Updates
- Added `disconnect` event listener
- Properly notifies parent component when wallet disconnects

## UI Improvements

- **Status Badges**: Color-coded status indicators (green for approved, red for rejected, yellow for pending)
- **Auto-refresh**: Policy status updates automatically
- **Modal Popup**: Professional disconnect notification with actions
- **Conditional Rendering**: VC section only appears when needed
- **Better Organization**: Logical flow from top to bottom

## User Experience

1. Users no longer see VC section until they've submitted a policy request
2. Users can track their policy request status in real-time
3. Users are immediately notified when MetaMask disconnects
4. Clear visual feedback for all actions and states

