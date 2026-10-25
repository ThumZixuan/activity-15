# Activity 15 — Privacy Implementation

> **🛠️ Stack for this lesson** — Expo SDK 54 / React Native 0.79 + `expo-secure-store` + `expo-image-manipulator` + `expo-crypto` + `expo-sharing` · runs in Expo Go on a real phone.
> 📥 Template: [/learn/m1/template/activity-15-privacy-implementation](/learn/m1/template/activity-15-privacy-implementation)

A photo app made privacy-respecting: hardware-encrypted storage of preferences, EXIF stripping before sharing, and GDPR-style consent that survives app reload. The screens, the consent banner, the photo card, the metadata viewer, and the `SecureStorageService` are wired up. You'll fill in the four privacy services / components that turn the UI into something that actually protects users.

**Time:** ~120 minutes · **Concept:** Concept 15 — Mobile Privacy and Secure Storage

---

## What You'll Build

| # | TODO | File |
|---|------|------|
| 2 | `PhotoPrivacyService` — strip EXIF (re-encode via `ImageManipulator`), generate anonymous filenames (`Crypto.getRandomBytesAsync(8)` → hex), and combine into `createShareableCopy` | `services/PhotoPrivacyService.js` |
| 3 | `PrivacyAwareShare.handleShare` — call `createShareableCopy`, check `Sharing.isAvailableAsync()`, share, then clean up the cache | `components/PrivacyAwareShare.js` |
| 4 | `ConsentService` — `getConsents`, `saveConsents`, `hasConsent`, `needsConsent` with version tracking | `services/ConsentService.js` |
| 5 | `PrivacySettingsScreen` — load consents on mount, save changes immediately, wire delete-everything to `SecureStorageService.clearAll()` | `screens/PrivacySettingsScreen.js` |

(TODO #1 was the SecureStorageService — already done for you as the foundation.)

## Run It

```bash
npm install --legacy-peer-deps
npx expo start
```

Scan the QR code with **Expo Go** on a phone that's on the same Wi-Fi as your computer. SecureStore behaves differently on web than on native — for full testing use a real device.

## Verify

Your activity is done when, on a real device:

- [ ] Tapping "Info" on a photo shows its metadata (date, location if any, device).
- [ ] Tapping "Share" with all three privacy switches on produces a shared file whose viewer reports no GPS, no device, no original date.
- [ ] The shared filename is something like `photo_a1b2c3d4e5f6.jpg`, not the original name.
- [ ] After sharing, the cache directory is empty (no leftover stripped copies).
- [ ] First launch shows the consent banner; saving choices and reloading the app skips the banner.
- [ ] Privacy Settings reflects whatever the user saved; toggling a switch persists immediately (no Save button needed).
- [ ] "Delete All Data" clears stored preferences — relaunch the app and the consent banner reappears.

## Stretch

Pick one and write what you tried in your reflection:
- Add a biometric lock (`expo-local-authentication`) so the privacy settings screen can only be opened after Face ID / fingerprint passes.
- Add an export-data flow that bundles every stored preference into a JSON file shared via the OS share sheet.
- Bump `CONSENT_VERSION` to `'1.1'` and confirm the consent banner reappears for users on the old version.

## 🪞 Reflect on Your Work

Answer in 2-3 sentences each, in this README under your TODO commits. Your tutor reads these as part of grading.

1. **What did you learn that you didn't know before?** Name the most surprising thing — a bug you hit, a syntax quirk, a way the simulator and real device differ.
2. **How did you collaborate with AI?** If you used Claude / ChatGPT / Cursor / Copilot, what part of the work did *you* contribute — the prompt, the verification, the design decision, the bug-fix? If you didn't use AI, what was the hardest thing to figure out alone?
3. **How do you know your code works?** Describe one specific thing you did to confirm — a test you ran, a screenshot you took, a behavior you watched on the device.

> AI is a great collaborator. Owning your thinking, verifying the output, and explaining your design choices is what *learning* looks like in this course.

## Submit

When the Verify checklist is green, head to **[/learn/m1/certification](/learn/m1/certification)** and submit your activity link. Include a screenshot showing: a shared photo file's metadata viewer reporting empty EXIF, plus the Privacy Settings screen with your saved consent state.

<!-- claude-template-fix: readme-v3 -->

## Implementation notes

The privacy services and sharing/settings workflows are implemented in this completed version. Image re-encoding removes the EXIF block as a whole; the switches are kept for the requested UI, but selecting any one removal option triggers full metadata removal because the Expo image manipulator does not support selective EXIF-field editing. The demo data export includes available privacy settings only, and the delete action clears app preferences and known secure-storage keys; it cannot delete photos or remote data that this template does not manage.
