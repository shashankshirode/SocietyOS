# Society OS — Mobile App (`apps/mobile`)

The mobile application for Society OS, built with React Native and Expo SDK 58.

## Technology Stack

- **Framework**: React Native 0.81.5 / Expo SDK 58
- **Language**: TypeScript 5.9 (Strict mode enabled)
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **State & Data**: Offline-first MockStore with deterministic local hydration and REST API adapters
- **Testing**: Jest with jest-expo, React Native Testing Library
- **Icons & Styling**: Expo Vector Icons, centralized Design System tokens

## Development Commands

```bash
# Start Metro bundler
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Typecheck
npm run typecheck

# Lint
npm run lint

# Run Jest tests
npm test

# Verify resident route matrix
npm run verify:resident-routes
```
