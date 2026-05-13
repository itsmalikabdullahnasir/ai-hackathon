---
name: Adaptive Core
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#5a4139'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#8e7067'
  outline-variant: '#e3bfb4'
  surface-tint: '#ad3300'
  primary: '#a93200'
  on-primary: '#ffffff'
  primary-container: '#d24206'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59e'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006b2d'
  on-tertiary: '#ffffff'
  tertiary-container: '#00873b'
  on-tertiary-container: '#f7fff3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#390b00'
  on-primary-fixed-variant: '#842500'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Sora
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Sora
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  sidebar-width: 280px
  gutter: 1.5rem
  margin-desktop: 2rem
  margin-mobile: 1rem
  unit-xs: 0.25rem
  unit-sm: 0.5rem
  unit-md: 1rem
  unit-lg: 1.5rem
  unit-xl: 2.5rem
---

## Brand & Style

The brand identity for the design system is built on the intersection of data-driven intelligence and human-centric education. It conveys a "Smart Adaptive" personality—predictive, professional, and high-fidelity. The target audience includes modern learners and educators who require a distraction-free environment that feels premium and technologically advanced.

The visual style is **Corporate / Modern** with a focus on high-fidelity execution. It utilizes a structured information hierarchy, clean layouts, and subtle depth to organize complex learning data. The aesthetic maintains a balance between the seriousness of a technical platform and the approachability of an educational tool, using rounded-xl corners and a sophisticated navy-and-orange palette to distinguish the experience from traditional, cluttered LMS platforms.

## Colors

The palette is anchored by a high-energy **Primary Orange (#E8521A)**, used strategically for calls-to-action and progress indicators to drive user engagement. This is balanced by a deep, authoritative **Dark Navy (#0F172A)** used for the sidebar and structural navigation, creating a focused, grounded frame for content.

The content area utilizes a subtle **#F8FAFC** light gray background to reduce eye strain, while white (#FFFFFF) is reserved for cards and elevated surfaces to create a clear visual hierarchy. Semantic colors—Success Green, Warning Amber, and Danger Red—are calibrated for high legibility against both white and light gray backgrounds, ensuring critical feedback is immediately recognizable in a learning context.

## Typography

The typography system uses a dual-font approach to balance technical precision with readability. **Sora** is utilized for headlines and display text; its geometric construction and unique character shapes provide a modern, tech-forward feel. **DM Sans** is the primary choice for body text and labels, selected for its exceptional legibility and neutral tone which supports long-form educational content.

For mobile devices, headline sizes scale down to prevent excessive wrapping. Use `display-lg-mobile` for page titles and hero sections on small screens. Letter spacing is slightly tightened on large display headers to maintain a premium, compact look.

## Layout & Spacing

This design system employs a **Fixed Grid** model for the main content area to ensure optimal line lengths for reading and learning. The primary layout consists of a persistent 280px sidebar on the left and a fluid content area that caps at 1440px.

A 12-column grid is used for dashboard layouts, allowing for flexible card arrangements (3-column, 4-column, or 2-column configurations). Spacing follows an 8px rhythmic scale. On mobile devices, the sidebar transitions into a hidden off-canvas drawer, and side margins compress to 16px (`margin-mobile`) to maximize screen real estate.

## Elevation & Depth

Visual hierarchy is established using **Tonal Layers** and **Ambient Shadows**. The base layer is the light gray background (#F8FAFC). Interactive elements and content containers are placed on white (#FFFFFF) "elevated" cards.

To signify depth, use `shadow-sm`: a subtle, diffused shadow (0px 1px 3px rgba(15, 23, 42, 0.1)). Higher elevation is reserved for modals and dropdowns, which use a slightly more pronounced shadow with a Dark Navy tint to maintain color harmony. The sidebar uses no shadow but relies on its high-contrast Dark Navy fill to establish itself as the primary navigational anchor.

## Shapes

The shape language is defined by a consistent **Rounded (2)** scale. This level of roundedness (0.5rem base) softens the professional navy/orange palette, making the interface feel more accessible and friendly for students.

- **Cards and Containers:** Use `rounded-xl` (1.5rem) to create a soft, modern enclosure for learning modules.
- **Buttons:** Use `rounded-lg` (1rem) for a distinct, pill-adjacent look that differentiates them from square layout containers.
- **Inputs and Small UI:** Use the base 0.5rem roundedness for a crisp, functional appearance.

## Components

### Buttons
- **Primary:** Orange (#E8521A) fill, white text, `rounded-lg`. On hover, darken to a deeper shade of orange.
- **Secondary:** Transparent fill with Dark Navy border and text.
- **Ghost:** No border, Muted text (#64748B), changing to Dark Navy on hover.

### Navigation
- **Sidebar Items:** White or light gray text against Dark Navy.
- **Active State:** A subtle orange tint background (low opacity) and a 4px solid orange (#E8521A) left border to clearly indicate the current location.

### Cards
- White background, `rounded-xl` corners, `shadow-sm`.
- Padding should be generous (1.5rem to 2rem) to maintain a premium feel.

### Input Fields
- White background, 1px border (#E2E8F0).
- Focus state uses an orange border and a subtle orange outer glow (ring).

### Adaptive Progress Indicators
- Use the Success Green (#22C55E) for completed modules.
- Use Primary Orange (#E8521A) for current "in-progress" items to signify active energy.

### Chips/Badges
- Small, `rounded-full` shapes with low-opacity background tints of their respective semantic color (e.g., light green tint for a "Completed" badge).
