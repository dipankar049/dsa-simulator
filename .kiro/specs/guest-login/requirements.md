# Requirements Document

## Introduction

This document defines the requirements for the **Guest Login** feature. The feature allows new users to begin using the app immediately — without creating a Google account — by entering as a guest. Guest users receive a locally-generated identity and can access all offline capabilities (routine management, calendar, alarms, and the home-screen widget). A persistent in-app upgrade path lets guests migrate to a full Google-authenticated account at any time, transferring all locally accumulated data to the server via the existing sync engine.

## Glossary

- **App**: The React Native mobile application being described.
- **AuthContext**: The React context that manages authentication state, including `isAuthenticated`, `isGuest`, `token`, and related lifecycle functions.
- **AuthNavigator**: The navigation stack rendered when no authenticated or guest session is active (Login, Landing, etc.).
- **Guest_Comparison_Modal**: The modal overlay shown when "Continue as Guest" is tapped, presenting a side-by-side summary of guest vs. authenticated feature availability.
- **Guest_Profile**: The locally stored data object `{ guestName, level, xp, isGuest: true }` that represents a guest user's identity and progress.
- **Google_Login_Flow**: The full sign-in sequence using Firebase Google Sign-In, including the Terms of Service / Privacy Policy checkbox.
- **Google_Login_Upgrade_Modal**: The reusable `GoogleLoginUpgradeModal` component that allows a guest to sign in with Google from within any screen without navigating away.
- **MainNavigator**: The navigation stack rendered when a user is either authenticated or in an active guest session.
- **NavigationRoot**: The top-level navigation component that decides whether to render `AuthNavigator` or `MainNavigator` based on auth state.
- **Sync_Engine**: The WatermelonDB-based synchronisation layer responsible for pushing local database mutations to the server.
- **XP_Calculator**: The existing local utility that computes experience points for completed tasks.
- **EncryptedStorage**: The on-device encrypted key-value storage used to persist sensitive data such as tokens and profiles.
- **Community_Screen**: The in-app screen where users can read and submit community feedback.
- **Profile_Screen**: The in-app screen where users view and manage their account details, XP, level, and settings.

## Requirements

### Requirement 1: Login Screen — Guest Entry Point

**User Story:** As a new user who is not ready to sign in with Google, I want to see a "Continue as Guest" option on the login screen, so that I can start using the app immediately without an account.

#### Acceptance Criteria

1. THE App SHALL render a "Continue as Guest" button on the Login screen, positioned below the existing "Continue with Google" button, visible without scrolling on screens with a minimum resolution of 320×568 points.
2. WHEN the "Continue as Guest" button is tapped, THE App SHALL display the Guest_Comparison_Modal before advancing the user into the app.
3. IF the Terms of Service / Privacy Policy checkbox is unchecked, THEN THE App SHALL NOT prevent the user from tapping the "Continue as Guest" button or block guest entry on that basis.
4. WHILE the Google login loading indicator is active, THE App SHALL disable the "Continue as Guest" button such that tapping it produces no navigation or auth action.
5. WHEN the Google login flow completes or is cancelled, THE App SHALL re-enable the "Continue as Guest" button.

---

### Requirement 2: Guest Comparison Modal

**User Story:** As a prospective guest user, I want to see a clear side-by-side summary of what I gain and lose as a guest, so that I can make an informed decision before entering the app.

#### Acceptance Criteria

1. WHEN the "Continue as Guest" button is tapped on the Login screen, THE App SHALL display the Guest_Comparison_Modal as a modal overlay using the dark theme with the app's primary purple accent colour.
2. THE Guest_Comparison_Modal SHALL list the following four unavailable features under a "What you'll miss" section, each with an appropriate icon: cloud backup, server-side push notifications, Community / Feedback access, and cross-device data restore.
3. THE Guest_Comparison_Modal SHALL list the following four available features under a "What you get" section, each with an appropriate icon: complete routine management and progress summary, complete calendar management, alarm reminders for tasks, and the Android home-screen widget.
4. THE Guest_Comparison_Modal SHALL include a motivation message stating that signing in with Google provides all guest features plus safe cloud backup so that routines and progress are preserved even if the app is uninstalled or the device is changed.
5. WHEN the primary "Continue with Google" button in the Guest_Comparison_Modal is tapped, THE App SHALL dismiss the Guest_Comparison_Modal.
6. WHEN the Guest_Comparison_Modal is dismissed via the primary button, THE App SHALL trigger the Google_Login_Flow, which includes the Terms of Service / Privacy Policy checkbox.
7. WHEN the secondary "Continue as Guest" button is tapped, THE App SHALL dismiss the Guest_Comparison_Modal and proceed to initialise the Guest_Profile and navigate to the MainNavigator.
8. WHEN the user taps outside the modal area or uses the Android back button while the Guest_Comparison_Modal is displayed, THE App SHALL dismiss the Guest_Comparison_Modal without initiating any auth flow and return the user to the Login screen.

---

### Requirement 3: Guest Identity and Local Profile

**User Story:** As a guest user, I want a local identity so that the app can display a personalised name and track my XP and level offline.

#### Acceptance Criteria

1. WHEN a user confirms guest entry, THE App SHALL generate a guest name in the format `Guest_XXXXXX` where `XXXXXX` is a 6-digit random numeric string (e.g. `Guest_482931`).
2. THE App SHALL persist the Guest_Profile `{ guestName, level, xp, isGuest: true }` to EncryptedStorage under a fixed key, where `guestName` is a non-empty string of at most 20 characters, `level` is an integer in the range 1 to 999, and `xp` is a non-negative integer in the range 0 to 999,999.
3. THE App SHALL compute XP for completed tasks locally using the existing XP_Calculator, with no network request.
4. WHEN XP is earned during a guest session, THE App SHALL update the `level` and `xp` fields in the stored Guest_Profile within 500 milliseconds of the triggering event.
5. IF a persisted Guest_Profile is found in EncryptedStorage at app launch, THEN THE App SHALL restore that profile and set `isGuest = true` in AuthContext without requiring the user to go through guest entry again.
6. IF EncryptedStorage returns a write error when persisting or updating the Guest_Profile, THEN THE App SHALL display an error message indicating the profile could not be saved and retain the Guest_Profile in memory for the remainder of the session.
7. IF the persisted Guest_Profile found at app launch is missing any required field or contains a value outside the defined bounds, THEN THE App SHALL discard the corrupted profile and proceed as if no Guest_Profile exists.

---

### Requirement 4: AuthContext — Guest State

**User Story:** As a developer, I want AuthContext to expose a first-class `isGuest` flag and guest-specific lifecycle functions, so that all components can branch on guest vs. authenticated state without inspecting the token directly.

#### Acceptance Criteria

1. THE AuthContext SHALL expose an `isGuest: boolean` field that is `true` when a guest session is active and `false` otherwise.
2. WHEN `loginAsGuest` is called with a valid GuestProfile, THE AuthContext SHALL persist the GuestProfile to EncryptedStorage, set `isGuest = true` in state, and ensure `token` remains `null`.
3. IF `loginAsGuest` is called with an invalid or missing GuestProfile, THEN THE AuthContext SHALL reject the call without modifying any state or storage.
4. WHEN `logoutGuest` is called while `isGuest` is `true`, THE AuthContext SHALL remove the GuestProfile from EncryptedStorage, call `clearLocalDatabase()`, and set `isGuest = false`.
5. IF `logoutGuest` is called while `isGuest` is `false`, THEN THE AuthContext SHALL resolve without performing any side effects.
6. WHEN `loginAsGuest` is called, THE AuthContext SHALL NOT set `isAuthenticated` to `true`.
7. WHEN the app launches and a valid GuestProfile is found in EncryptedStorage, THE AuthContext SHALL set `isGuest = true` and restore the GuestProfile before rendering any consumer component.
8. IF the GuestProfile found in EncryptedStorage at launch is corrupted or incomplete, THEN THE AuthContext SHALL remove it from storage and set `isGuest = false`, leaving the user in the unauthenticated state.

---

### Requirement 5: Navigation Gate — Guest Access to Main App

**User Story:** As a guest user, I want to access the main app screens after choosing guest mode, so that I can use all available offline features.

#### Acceptance Criteria

1. WHEN `isAuthenticated` is `false` AND `isGuest` is `true`, THE NavigationRoot SHALL render `MainNavigator` instead of `AuthNavigator`.
2. WHEN both `isAuthenticated` and `isGuest` are `false`, THE NavigationRoot SHALL render `AuthNavigator`.
3. WHEN `isAuthenticated` is `true` (regardless of `isGuest`), THE NavigationRoot SHALL render `MainNavigator`.
4. WHEN auth state changes, THE NavigationRoot SHALL complete the corresponding navigator transition within 300 milliseconds.
5. IF both `isAuthenticated` and `isGuest` are `true` simultaneously (transient race condition during upgrade), THEN THE NavigationRoot SHALL treat `isAuthenticated = true` as the authoritative signal and render `MainNavigator`.

---

### Requirement 6: Sync Engine — Guest Mode Suppression

**User Story:** As a developer, I want the WatermelonDB sync trigger to be completely suppressed for guest users, so that sync attempts never fire unauthenticated requests that would cause 401 errors and trigger logout.

#### Acceptance Criteria

1. THE Sync_Engine SHALL expose an `isSyncEnabled(): boolean` guard function that returns `false` when `isGuest` is `true`, returns `true` when `isAuthenticated` is `true`, and returns `false` when neither flag is set.
2. WHEN the WatermelonDB change observer detects a database mutation AND `isSyncEnabled()` returns `false`, THE Sync_Engine SHALL skip scheduling the debounced `syncDatabase()` call and leave any currently pending debounce timer unchanged.
3. IF `syncDatabase()` is called while `isSyncEnabled()` returns `false`, THEN THE Sync_Engine SHALL return immediately without making any network request and without modifying local database state.
4. WHILE `isGuest` is `true`, THE Sync_Engine SHALL NOT call the sync API endpoint under any circumstances.
5. WHEN `isGuest` transitions from `true` to `false` (guest-to-Google upgrade), THE Sync_Engine SHALL cancel any debounced sync call that was scheduled during the guest session before allowing new authenticated syncs to fire.

---

### Requirement 7: Profile Screen — Guest Variant

**User Story:** As a guest user viewing my profile, I want to see my local XP and level alongside a clear prompt to back up my data, so that I understand my offline status and have an easy path to secure my progress.

#### Acceptance Criteria

1. WHILE `isGuest` is `true`, THE Profile_Screen SHALL display the guest name (`Guest_XXXXXX`) as the username and a default user icon in place of an avatar image.
2. WHILE `isGuest` is `true`, THE Profile_Screen SHALL display the `level` and `xp` values sourced from the locally stored Guest_Profile, without making any network request.
3. WHILE `isGuest` is `true`, THE Profile_Screen SHALL hide the "Email Address" row from the Account & Support settings list.
4. WHILE `isGuest` is `true`, THE Profile_Screen SHALL hide the "Delete Account" row from the Account & Support settings list.
5. WHILE `isGuest` is `true`, THE Profile_Screen SHALL render a "Backup Your Data" card section positioned between the profile card and the Account & Support section.
6. THE "Backup Your Data" card SHALL display a brief message communicating that uninstalling the app or changing devices will permanently erase all local data, and that signing in with Google backs everything up safely.
7. THE "Backup Your Data" card SHALL include a full-width "Sign in with Google" button that opens the Google_Login_Upgrade_Modal when tapped.
8. WHILE `isGuest` is `true`, WHEN the "Log out" button is tapped, THE Profile_Screen SHALL display a confirmation modal with the title "Sign Out?" and body "This will permanently erase all your local data. Once gone, it cannot be recovered." before executing the logout.
9. THE guest logout confirmation modal SHALL include a primary danger-styled "Erase & Sign Out" button and a secondary "Cancel" button; tapping "Cancel" SHALL dismiss the modal without performing any action.
10. WHEN the "Erase & Sign Out" button is confirmed, THE App SHALL erase all local data and navigate to the Landing screen.
11. IF `logoutGuest()` fails during the "Erase & Sign Out" flow, THE App SHALL display an error message and remain on the Profile screen without navigating away.

---

### Requirement 8: Community Screen — Guest Interaction Gate

**User Story:** As a guest user browsing the Community screen, I want to read community feedback freely, but when I try to post I should be prompted to sign in, so that I understand why posting requires an account.

#### Acceptance Criteria

1. WHILE `isGuest` is `true`, THE Community_Screen SHALL render the community feedback feed in read-only mode, displaying all published community posts.
2. WHILE `isGuest` is `true`, THE Community_Screen SHALL render the text input composer area so that the user can type feedback of up to the existing character limit.
3. WHEN a guest user taps the "Post" submit button, THE Community_Screen SHALL NOT submit the feedback and SHALL instead display the Google_Login_Upgrade_Modal within 300ms of the tap.
4. WHILE `isGuest` is `true`, THE Community_Screen SHALL NOT gate or hide the My Feedback section list and SHALL display the empty state when no feedback entries exist.
5. IF the Google_Login_Upgrade_Modal is dismissed without completing sign-in, THEN THE Community_Screen SHALL return focus to the composer area with any previously typed text preserved.

---

### Requirement 9: Google Login Upgrade Modal

**User Story:** As a guest user, I want a reusable, in-context modal that lets me sign in with Google without leaving my current screen, so that I can upgrade my account and retain all my locally accumulated data.

#### Acceptance Criteria

1. THE App SHALL provide a reusable `GoogleLoginUpgradeModal` component located in `src/components/GoogleLoginUpgradeModal`.
2. THE GoogleLoginUpgradeModal SHALL be styled using the app's dark theme and primary purple accent as a modal overlay.
3. THE GoogleLoginUpgradeModal SHALL display the message: "Your current routines and data will be safely synced to the server when you sign in."
4. IF the Terms of Service / Privacy Policy checkbox is unchecked, THEN THE Google login button SHALL NOT be enabled or tappable.
5. WHEN the Terms of Service / Privacy Policy checkbox is checked, THE Google login button SHALL become enabled and tappable.
6. WHEN the enabled Google login button is tapped, THE App SHALL trigger the full Google_Login_Flow (Firebase Google Sign-In).
7. WHEN the Google_Login_Flow succeeds during an upgrade, THE App SHALL store the server-issued JWT token and user profile via `AuthContext.login()` and set `isGuest = false`.
8. WHEN step 7 completes, THE App SHALL call `syncDatabase()` once to push all locally created records to the server, and the app SHALL present the authenticated view without requiring explicit navigation.
9. IF the Google_Login_Flow fails during upgrade, THEN THE GoogleLoginUpgradeModal SHALL display an error message and remain open so the user can retry.
10. IF `syncDatabase()` fails after a successful login during upgrade, THE App SHALL display a non-blocking warning toast ("Sync failed — your data will sync when you're back online") and proceed to the authenticated view without rolling back the login.
11. THE GoogleLoginUpgradeModal SHALL include a dismiss control that closes the modal without altering any auth state.

---

### Requirement 10: Guest-to-Google Data Migration

**User Story:** As a guest user who upgrades to a Google account, I want all the habits and progress I built as a guest to appear on my new account, so that I don't lose any work when I sign in.

#### Acceptance Criteria

1. WHEN the Google_Login_Flow completes successfully from the Google_Login_Upgrade_Modal, THE App SHALL initiate a single full data sync to push all locally created records — including routines, daily logs, and calendar events created during the guest session — to the server.
2. WHEN a successful upgrade occurs, THE App SHALL remove the Guest_Profile (guestName, local XP, local level) from EncryptedStorage; the server-side user profile SHALL become the source of truth for XP and level.
3. THE App SHALL NOT require any additional migration endpoint or data transformation beyond the standard sync call described in Acceptance Criterion 1.
4. WHEN `isGuest` transitions from `true` to `false` as a result of a successful upgrade, THE App SHALL enable normal authenticated sync behaviour for all subsequent user mutations.
5. IF the data sync fails after a successful login, THE App SHALL display a non-blocking warning ("Sync failed — your data will sync when you're back online") and allow the user to proceed to the authenticated view; the data SHALL remain in local storage and sync automatically when connectivity is restored.
