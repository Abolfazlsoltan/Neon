# NEON RUN

A Persian-first neon endless runner built with Canvas 2D and Capacitor for Android.

## Game features
- Touch-first controls: tap for double jump, swipe down for a fast fall
- Four neon city zones with increasing speed and difficulty
- Procedural spike, block and drone obstacles
- Crystal arcs, combo scoring, Neon Fever and collectible power-ups
- Local profile, saved high score, wallet, six skins and three upgrade paths
- Career missions and player statistics
- Offline gameplay; no account, ads, analytics or online leaderboard

## Main modules
- `src/engine.js` — simulation, collision, procedural world and Canvas renderer
- `src/ui.js` — menus, HUD, garage, missions and profile screens
- `src/app.js` — app state, input, local persistence, audio and progression

## Run locally
Requires Node.js 22 or newer.

```bash
npm install
npm run check
npm run build
```

To create the Android project locally:

```bash
npm run android:add
npm run android:sync
```

Open the generated `android/` directory in Android Studio. The Android folder is generated during CI and is intentionally not committed.

## Android CI
Every push to `main` and every manual workflow dispatch runs `.github/workflows/android.yml`. It builds:
- Debug APK for device testing
- Release AAB for Play Console preparation

The workflow targets Android 16 / API 36. Google Play requires API 36 or higher for new apps and updates from August 31, 2026.

### Signing the AAB
Configure these repository Actions secrets to sign the release bundle:
- `ANDROID_KEYSTORE_BASE64` — base64-encoded upload keystore
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

Without these secrets, the workflow produces an unsigned AAB for inspection. An unsigned AAB cannot be uploaded to Play Console. Never commit a keystore or passwords.

## Google Play checklist
The repository contains a starter privacy policy at `privacy-policy.html`. Before submitting:
1. Create the app in Play Console and choose the final app name and package identity.
2. Create an upload keystore and add the four signing secrets above.
3. Publish the privacy policy at a public HTTPS URL.
4. Complete Data safety, content rating, target audience and app access declarations accurately.
5. Prepare store listing text, icon, feature graphic and phone screenshots.
6. Upload the signed AAB to an internal testing track and test on real devices before production review.

The app currently stores game progress locally and has no account, ad, analytics or network backend. Re-check the actual release build and declarations before submission.
