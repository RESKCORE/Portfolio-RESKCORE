# Comprehensive Spacing, Alignment, and Responsive Menu Calibration

A systematic fix for all typography spacing errors, irregular section alignments, and viewport shifts across all breakpoints, including dynamic responsive radial scaling and centering for the circular menu.

> [!IMPORTANT]
> **Confirmed User Decisions & Requirements**:
> - **Comprehensive Fix**: Fix all spacing errors, irregular section alignments, and layout shifts across every block and section.
> - **Typography Across Breakpoints**: Fluid, balanced typography with consistent baseline rhythm, balanced text wrap, and zero text overflow from mobile (320px) to ultra-wide (2560px).
> - **Circular Menu Positioning**: Eliminate horizontal menu drift to the left side by dynamically scaling the circular radius and button positioning relative to viewport geometry, preventing any viewport spill.
> - **Viewport Integrity**: Enforce strict horizontal containment (`overflow-x: hidden`) at the root document level to prevent layout shifts.

---

### 1. Overview & Core Concept

The RESK portfolio features an avant-garde dark aesthetic with fluid WebGL simulations, custom typography clamps, and a cinematic circular menu. Currently, on various viewport widths, hardcoded positioning and unbounded transforms cause irregular spacing, horizontal shifts, and the menu overlay/dome to drift awkwardly to the left. 

This update resolves all underlying layout irregularities, establishing a mathematical spacing scale, responsive radial math for the circular menu, and robust grid alignments across all 5 routes.

---

### 2. User Experience & Visual Design

#### A. Viewport & Menu Alignment (Addressing the Leftward Drift)
- **Root Overflow Containment**: Prevent horizontal scroll drift by applying `overflow-x: hidden` to root containers, eliminating unwanted lateral document shifts.
- **Dynamic Radial Menu**: Replace the fixed `radius = 210` with responsive, viewport-aware radial coordinates:
  - Mobile (<640px): `radius ≈ 105px - 130px`, button size scaled with `text-[10px]` and compact icons.
  - Tablet (640px - 1024px): `radius ≈ 160px - 180px`.
  - Desktop (>1024px): `radius ≈ 210px`.
  - Center coordinates calculated cleanly as percentage offsets (`calc(50% + cos(θ) * R)` / `calc(50% + sin(θ) * R)`) so items remain perfectly circular and centered without spilling outside the screen or pulling the container left.
- **Bottom Dome Button**: Recalibrate the fixed bottom trigger dome (`left-1/2 -translate-x-1/2`) with responsive dimensions (`w-[14rem] sm:w-[18rem] md:w-[20rem]`) and responsive z-indexing so it never collides with side status copy.

#### B. Global Typographic & Spacing Rhythm
- **Consistent Gutter Scale**: Standardize the container system across all pages to a uniform gutter padding (`px-4 sm:px-6 md:px-10 lg:px-16`) and maximum width (`max-w-[1440px] mx-auto`).
- **Baseline Typography**:
  - Hero Display: `clamp(2.75rem, 9vw, 9.5rem)` with balanced line-height to prevent letter clipping.
  - Section Headings: `clamp(2rem, 5vw, 4.5rem)`.
  - Subtitles & Meta: `clamp(0.75rem, 1.2vw, 0.95rem)` with tabular figures (`tabular-nums`) and clean typographic separators.
  - Body Text: `text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl` with `text-wrap: balance`.

---

### 3. Key Product Decisions & Trade-Offs

- **Dynamic Coordinate Math vs Fixed Pixels in Menu**:
  - *Chosen Approach*: Compute radial button positions using responsive scale factors tied to viewport dimensions.
  - *Why*: Fixed 210px radius on a 300px mobile container causes buttons to overflow 60px past the left viewport boundary, triggering horizontal shift and misalignments.
  - *Alternatives Considered*: Switching to a vertical list on mobile. Passed over because the circular ring is a core brand signature that can be made fully responsive.

- **Unified Container System**:
  - *Chosen Approach*: Replace divergent padding rules in individual components with a standardized `.container` definition in `index.css` paired with explicit inner wrappers.
  - *Why*: Guarantees that the Top Nav, Hero, Body Sections, and Footer share exact vertical alignment lines across the entire app.

---

### 4. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────┐
│                        index.html                      │
│        (Root Overflow Guard & Typography Fonts)        │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    App.tsx / Router                    │
│   (PageTransitionGrid, Nav, FluidSimulation, Menu)     │
└─────────────┬────────────────────────────┬─────────────┘
              │                            │
   ┌──────────▼──────────┐      ┌──────────▼──────────┐
   │    Top Navigation   │      │    Circular Menu    │
   │  - IST Clock (Left) │      │  - Dynamic Radius   │
   │  - RESK Logo (Ctr)  │      │  - Polar Coordinates│
   │  - Location (Right) │      │  - Centered Dome    │
   └─────────────────────┘      └─────────────────────┘
              │
   ┌──────────▼──────────────────────────────────────────┐
   │                  Page Routes                        │
   │  ├─ Home.tsx     (Balanced hero & status anchors)   │
   │  ├─ Work.tsx     (Asymmetric grid & project cards)  │
   │  ├─ Lab.tsx      (At a glance, stats, tech stack)   │
   │  ├─ Project.tsx  (Editorial meta, case study copy)  │
   │  └─ Contact.tsx  (Form inputs & 4-icon grid)        │
   └─────────────────────────────────────────────────────┘
              │
   ┌──────────▼──────────┐
   │      Footer.tsx     │
   │  - Large RESK Word  │
   │  - Symmetrical Grid │
   └─────────────────────┘
```

---

### 5. Step-by-Step Implementation Strategy

1. **Global Styles (`index.css`)**:
   - Add `overflow-x: hidden` to `html`, `body`, and `#root`.
   - Normalize `.container` margins, fluid padding, and unified clamp typography.
2. **Circular Menu & Dome (`Menu.tsx`)**:
   - Implement dynamic viewport-aware radius calculation hook or responsive radius state (`window.innerWidth` listener).
   - Ensure `menuRef` and all radial links stay centered within `[300px, 540px]` ring bounds.
   - Refine dome toggle button centering and bottom offset.
3. **Top Navigation (`Nav.tsx`)**:
   - Ensure 3-column split (Clock, Centered Logo, Location) has equal column widths and consistent gutters matching page content.
4. **Home Page (`Home.tsx`)**:
   - Align hero typography and provide ample vertical clearance above the bottom status bars so text never collides with the dome toggle.
5. **Work Page (`Work.tsx`)**:
   - Align project titles, short tech tags, and asymmetric card aspect ratios cleanly across mobile, tablet, and desktop viewports.
6. **Lab / About Page (`Lab.tsx`)**:
   - Align "At a Glance" split columns, "Numbers" 4-column metric grid, and "Tech Stack" row spacing.
7. **Project Page (`Project.tsx`)**:
   - Align metadata grid (Client, Period, Discipline, Status), editorial paragraphs, 3D tunnel frames, and credits section.
8. **Contact Page (`Contact.tsx`)**:
   - Standardize input line spacing, focus transitions, send button width, and center the 4-column social link grid.
9. **Footer (`Footer.tsx`)**:
   - Calibrate the giant "RESK" display typography clamp so it scales edge-to-edge without overflow or awkward margins.
10. **Build & Quality Verification**:
    - Run `lint_applet` and `compile_applet` to confirm zero errors.
