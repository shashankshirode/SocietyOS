# Society OS

Society OS is an enterprise-grade community and society operating system designed to manage residential societies, visitor security, facility operations, billing and accounting, communication, and governance.

## Monorepo Architecture

The repository is structured as a unified monorepo housing both frontend and backend systems:

```text
SocietyOS/
│
├── apps/
│   ├── mobile/             # React Native / Expo / TypeScript mobile application
│   └── api/                # [Reserved] Java 25 / Spring Boot 4 backend service
│
├── contracts/              # Language-neutral API contracts & OpenAPI specifications
├── infra/                  # Infrastructure, containerization, and orchestration
├── docs/                   # System architecture and technical documentation
├── .maestro/               # End-to-end user journey test definitions
└── .github/                # GitHub Actions workflows & CI/CD pipelines
```

### Current Status

- **Frontend (`apps/mobile/`)**: Fully functional React Native application running on Expo SDK 58, React 19, and TypeScript with complete offline-first MockStore hydration, role-based navigation, and 370+ test suites.
- **Backend (`apps/api/`)**: Reserved for the upcoming Java 25 / Spring Boot backend service. **The backend has not yet been implemented.** The `apps/api` directory is reserved for Phase 1 backend initialization.
- **Shared Contracts (`contracts/`)**: Reserved for shared OpenAPI specs and client contract generators.

---

## Getting Started: Mobile Application

### Requirements

- Node.js >= 20.x (Node 22 recommended)
- npm >= 10.x
- Watchman (macOS)
- Expo Go (iOS/Android device) or Xcode Simulator / Android Studio Emulator

### Installation

From the monorepo root:

```bash
cd apps/mobile
npm ci
```

### Development Commands

All mobile commands can be run directly from `apps/mobile/` or via root orchestration scripts:

| Action | Root Command | Direct Command (`apps/mobile`) |
|---|---|---|
| Start Dev Server | `npm run mobile:start` | `npm start` |
| Start on Android | `npm run mobile:android` | `npm run android` |
| Start on iOS | `npm run mobile:ios` | `npm run ios` |
| Start on Web | `npm run mobile:web` | `npm run web` |
| TypeScript Check | `npm run mobile:typecheck` | `npm run typecheck` |
| Lint Check | `npm run mobile:lint` | `npm run lint` |
| Run Test Suite | `npm run mobile:test` | `npm test` |
| Resident Routes | `npm run mobile:verify:resident-routes` | `npm run verify:resident-routes` |
| Import Cycle Audit | `npm run mobile:verify:import-cycles` | `npm run verify:import-cycles` |
| Export iOS Bundle | `npm run mobile:export` | `npx expo export --platform ios` |

---

## Git & Branch Strategy

- **Repository**: `shashankshirode/SocietyOS`
- **Primary Branch**: `main`
- **Feature Branches**: `feat/*`, `fix/*`, `chore/*`
- Atomic pull requests coordinating contracts and application updates.
