# SocietyOS Canonical Design System

**Status:** Canonical Reference  
**Brand Aesthetic:** Calm, Modern, Premium, Trustworthy (Moss Green & Warm Canvas)

---

## 1. Palette & Semantic Color Tokens

SocietyOS uses a curated dual-mode color system defined in `src/shared/theme/colors.ts`:

### Light Palette (Primary Theme)
- **Primary / Brand:** `#064F43` (Deep Moss Green)
- **Primary Soft:** `#EEF5F0` (Muted Sage Tint)
- **Primary Pressed:** `#033B34` (Deep Forest)
- **Canvas / Background:** `#F8F6F0` (Warm Cream Canvas)
- **Surface / Card:** `#FFFFFF` (Pure White)
- **Surface Muted:** `#F2F1EB` (Subtle Neutral Surface)
- **Text Primary:** `#111613` (High-contrast charcoal green)
- **Text Secondary:** `#626A65` (Muted slate green)
- **Border Default:** `#E5E3DC` (Subtle boundary line)
- **Success:** `#16A34A` / Soft: `#DCFCE7`
- **Warning:** `#D97706` / Soft: `#FEF3C7`
- **Danger:** `#DC2626` / Soft: `#FEE2E2`

### Semantic Usage Rule
Under no circumstances should raw hex literals (`#064F43`, `#FFFFFF`, `#111613`) be scattered across feature screen components. All visual elements must consume tokens via:
```tsx
const { colors } = useAppTheme();
// colors.primary, colors.surface, colors.textPrimary, etc.
```

---

## 2. Canonical UI Primitives (`src/shared/components/`)

All resident user experiences compose these canonical primitives:

1. **`SocietyScreen`:**
   - Standard screen container providing safe area inset handling, responsive horizontal gutters, optional keyboard-aware scrolling, and status bar synchronization.
2. **`SocietyCard`:**
   - Card container with standardized elevation (shadow on iOS, elevation on Android), border radius (16px), background tokens, and optional pressable feedback.
3. **`SocietyDetailHeader`:**
   - Standardized top navigation bar supporting title, optional subtitle, back button with accessibility hit slop, and right-hand action affordances.
4. **`SocietyInput`:**
   - High-contrast, accessible text input with floating label, validation error feedback, left/right icon slots, and keyboard focus states.
5. **`SocietyButton`:**
   - Interactive button with `primary`, `secondary`, `quiet`, `ghost`, `danger`, `success`, and `outline` variants. Supports loading spinner, left/right icons, accessibility roles, and press scaling.
6. **`SocietyStatusPill`:**
   - Standard badge for lifecycle states (`APPROVED`, `EXPECTED`, `RESOLVED`, `COMPLETED`, `CANCELLED`).
7. **`SocietyFilterPills` & `SocietySegmentedControl`:**
   - Filtering and segmented tab switching for lists and views.
8. **`SocietyTimeline`:**
   - Linear step tracker for complaint resolution, visitor progress, and payment confirmations.
9. **`SocietySuccessView`:**
   - Full-bleed animated checkmark and transactional summary for completed flows (Pass created, Payment success, Complaint lodged).

---

## 3. Responsive & Keyboard Guidelines

- **Responsive Breakpoints:** Layouts adapt smoothly across small phones (≤360px), standard phones (375-430px), and foldables/tablets (≥600px) using `useResponsiveLayout`.
- **Keyboard Handling:** Forms use `KeyboardAvoidingView` or `SocietyScreen` with scroll containment so that the active input and submission CTA are never obscured by the virtual keyboard.
