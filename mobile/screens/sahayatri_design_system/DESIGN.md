---
name: Sahayatri Design System
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#3f4944'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#6f7973'
  outline-variant: '#bec9c2'
  surface-tint: '#1b6b51'
  primary: '#004532'
  on-primary: '#ffffff'
  primary-container: '#065f46'
  on-primary-container: '#8bd6b7'
  inverse-primary: '#8bd6b6'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe932c'
  on-secondary-container: '#663500'
  tertiary: '#00415f'
  on-tertiary: '#ffffff'
  tertiary-container: '#005980'
  on-tertiary-container: '#8bcfff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a6f2d1'
  primary-fixed-dim: '#8bd6b6'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#00513b'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is built on the principles of **Mutual Aid, Safety, and Reliability**. It targets a community-focused audience in Nepal, where trust and legibility are paramount. The aesthetic follows a **Corporate / Modern** direction with high-utility layouts, ensuring the interface remains functional under high-glare outdoor conditions.

The emotional response should be one of "calm assurance." By utilizing a structured grid and a disciplined color palette, the UI facilitates quick decision-making for drivers and riders alike. The style avoids unnecessary flourishes, focusing instead on clarity, accessibility, and a mobile-native experience that feels both professional and local.

## Colors

The color palette is dominated by **Deep Emerald Green**, signaling safety, growth, and community trust. **Warm Amber** is used sparingly as an action-oriented accent for high-priority alerts, rewards, and status badges. 

- **Primary (#065F46):** Core branding, primary buttons, and active navigation states.
- **Secondary (#D97706):** Credits, "Urgent" badges, and rating stars.
- **Neutrals (#1E293B):** Used for primary text to ensure maximum contrast (WCAG AAA compliant) against white surfaces.
- **Background (#F8FAFC):** A slightly cool off-white to reduce eye strain and differentiate the canvas from white card elements.

## Typography

The typography uses **Inter**, a highly legible sans-serif designed for screens. Given the "mutual aid" context, readability in various lighting conditions is critical. 

- **Scalability:** Large headlines scale down on mobile to prevent awkward line breaks (e.g., 32px to 28px).
- **Weight:** Use Semi-Bold (600) for interactive elements and Medium (500) for secondary information.
- **Contrast:** Always use the Neutral (#1E293B) for body text on light backgrounds. Never use pure black.

## Layout & Spacing

This design system employs a **mobile-first, fluid grid** approach. 

- **Grid System:** On mobile, use a 4-column layout with 16px margins. On desktop, transition to a 12-column fixed grid (max-width: 1140px).
- **Spacing Rhythm:** Use a strict 4px/8px incremental system. 
- **Touch Targets:** Ensure all interactive elements (buttons, inputs) have a minimum height of 48px to accommodate one-handed mobile use.
- **Safe Areas:** Adhere to hardware safe areas for modern notched smartphones, ensuring fixed navigation bars do not overlap system UI.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** supplemented by subtle **Ambient Shadows**. 

1. **Level 0 (Background):** #F8FAFC - The base canvas.
2. **Level 1 (Cards/Surface):** #FFFFFF - Pure white surfaces for content containers.
3. **Level 2 (Interaction):** Shadows should be soft and tinted with the primary color (e.g., `rgba(6, 95, 70, 0.08)`) with an 8px blur and 4px vertical offset. This makes cards appear to "lift" off the page without creating harsh contrast.

Avoid heavy borders; use subtle 1px strokes in a light gray (#E2E8F0) for card boundaries when shadows are not preferred.

## Shapes

The design system uses **Rounded** geometry (8px base radius) to strike a balance between professional rigor and community-focused friendliness.

- **Buttons & Inputs:** Use the standard 8px (0.5rem) radius.
- **Cards:** Use 16px (1rem) for large containers to create a distinct visual "nesting" for content.
- **Badges/Chips:** Use full pill-shaped rounding (999px) to distinguish them from interactive buttons.

## Components

### Buttons
- **Primary:** Deep Emerald background with White text. Bold, 16px font size.
- **Secondary:** White background with Deep Emerald border (1px) and text.
- **Ghost:** No background or border; Deep Emerald text for low-priority actions.

### Cards
- Standard ride cards should feature a 16px padding, white background, and a Level 2 shadow.
- Use a vertical progress-stepper style for "From" and "To" location points within the card.

### Inputs
- Text fields use a 1px #CBD5E1 border, 8px corner radius, and 12px horizontal padding.
- Focused state: 2px Deep Emerald border.

### Navigation
- **Bottom Navigation Bar:** Fixed to the bottom on mobile. Use 24px icons with 12px labels in #64748B, switching to Primary color for active states.

### Badges & Chips
- Use Warm Amber background with dark text for "Verified User" or "Active Credit" indicators.
- Use a light green tint for "Available" ride status.