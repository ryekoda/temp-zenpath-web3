# Zenpath Website Design System

Version: 1.0\
Purpose: A reusable visual and UX specification for AI assistants and
developers working on the Zenpath website.

## 1. Product and brand

**Product:** Zenpath\
**Category:** Care-transit dispatch and coordination software\
**Core job:** Help care-transit teams plan rides, coordinate staff, and
track trips in one place.

### Brand personality

-   Modern, calm, capable, clear, and trustworthy.
-   Friendly and human, but still professional enough for operational
    software.
-   Minimal and spacious rather than flashy or overly decorative.
-   Use green to communicate progress, clarity, and action---not to
    color every element.

### Core message

Zenpath helps care-transit teams coordinate rides, teams, and schedules
in one place.

Use plain language. Avoid vague SaaS claims such as "revolutionary,"
"game-changing," or "the future of work." Prefer concrete benefits: less
manual work, clearer coordination, and better trip visibility.

## 2. Color system

The values below are the canonical starting palette based on the current
visual direction. Treat them as design tokens. If the live codebase
already contains a close, established brand value, inspect and reuse it
rather than introducing a competing green.

### Brand colors

  -----------------------------------------------------------------------
  Token                   Hex                     Usage
  ----------------------- ----------------------- -----------------------
  `--color-brand-500`     `#20C997`               Primary Zenpath green;
                                                  brand mark, primary
                                                  buttons, key icons

  `--color-brand-600`     `#0FA978`               Hover/active states and
                                                  stronger green emphasis

  `--color-brand-700`     `#087F5B`               Dark green for
                                                  accessible emphasis,
                                                  icon strokes, and text
                                                  on pale green

  `--color-brand-100`     `#D9F7ED`               Soft green icon
                                                  backgrounds and subtle
                                                  highlights

  `--color-brand-50`      `#F0FBF7`               Pale green section
                                                  backgrounds and subtle
                                                  surface tint
  -----------------------------------------------------------------------

### Neutral colors

  ------------------------------------------------------------------------
  Token                    Hex                     Usage
  ------------------------ ----------------------- -----------------------
  `--color-ink-900`        `#101A33`               Main headings and
                                                   high-emphasis text

  `--color-ink-700`        `#263B5A`               Body text and secondary
                                                   headings

  `--color-ink-500`        `#607895`               Supporting copy and
                                                   descriptive text

  `--color-ink-400`        `#8DA0B6`               Placeholder text and
                                                   low-emphasis metadata

  `--color-border`         `#DCE6EE`               Card borders, input
                                                   borders, dividers

  `--color-surface`        `#FFFFFF`               Cards, navigation, form
                                                   fields

  `--color-surface-soft`   `#F7FAFC`               Subtle neutral section
                                                   backgrounds

  `--color-page`           `#FFFFFF`               Main page background
  ------------------------------------------------------------------------

### Functional status colors

Status colors are reserved for information inside the product UI. Do not
use them as extra brand colors.

  Token                    Hex         Usage
  ------------------------ ----------- ------------------------------------
  `--color-success`        `#0F9F6E`   Successful or completed actions
  `--color-success-soft`   `#DDF7EB`   Success status background
  `--color-info`           `#2798D8`   En-route or informational status
  `--color-info-soft`      `#E1F3FD`   Informational status background
  `--color-warning`        `#D99A16`   Attention needed
  `--color-warning-soft`   `#FFF3D6`   Warning status background
  `--color-danger`         `#D94667`   Urgent issue or destructive action
  `--color-danger-soft`    `#FCE7ED`   Danger status background

### Color rules

1.  Use white as the dominant background, navy for typography, and green
    for actions and highlights.
2.  Aim for roughly **75--85% white or neutral surfaces, 10--20% pale
    tinted surfaces, and 5% strong brand color** across a typical page.
3.  Use green for the primary CTA, logo, small accent lines, selected
    navigation, and important icons. Do not make every heading, card, or
    paragraph green.
4.  Use pale green as a background tint, not as a replacement for white
    everywhere.
5.  Keep body text dark enough to read comfortably. Do not use pale
    blue-gray for essential copy.
6.  Never rely on color alone to convey a trip status; include a
    readable label such as "Ready," "En route," or "Complete."
7.  Check contrast for all text and interactive states. When in doubt,
    use `--color-brand-700` for text on pale green and white text on
    `--color-brand-600` or darker.
8.  Avoid introducing purple, bright orange, gradients in every section,
    or multiple unrelated accent colors.

## 3. Typography

### Font direction

Use **Inter** if it is already available. Otherwise use a clean system
sans-serif stack:

`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Do not add a decorative display font. Typography should feel crisp,
modern, and highly readable.

### Type scale

  Token             Desktop size     Weight Typical usage
  --------------- -------------- ---------- ----------------------------------
  `--text-xs`               12px   400--500 Dashboard metadata, fine print
  `--text-sm`               14px   400--500 Navigation, labels, secondary UI
  `--text-base`             16px        400 Body copy and form text
  `--text-lg`               18px   400--500 Lead paragraphs
  `--text-xl`           22--24px        600 Card headings
  `--text-2xl`          30--36px   650--700 Section headings
  `--text-hero`         52--68px   700--800 Main hero headline

Use responsive sizing: the hero headline should reduce to approximately
40--46px on small screens. Use tight line-height for large headings
(about 0.98--1.08) and comfortable line-height for body copy (about
1.5--1.7). Avoid excessively wide paragraphs.

## 4. Layout and spacing

### General layout

-   Use a centered content container with a maximum width around
    **1280--1360px**.
-   At desktop widths, use approximately 48--72px of outer horizontal
    padding; reduce this on tablets and phones.
-   Use a consistent spacing scale based on 4px:
    `4, 8, 12, 16, 24, 32, 48, 64, 80, 96`.
-   Keep generous whitespace, but ensure every section has a clear
    purpose. Do not leave large accidental empty gaps.
-   Align section edges, cards, headings, and dashboard imagery to a
    consistent grid.
-   Use a clear vertical rhythm between sections, typically 80--112px on
    desktop and 48--72px on mobile.

### Grid and responsive behavior

-   Desktop hero: two columns, approximately 45% text and 55% product
    visual.
-   Feature cards: three columns on desktop, two on tablet when
    appropriate, one column on mobile.
-   Product showcase: text and product image side by side on desktop;
    stack on mobile with the text first.
-   Prevent horizontal overflow. Tables and dashboard mockups must scale
    down, crop intentionally, or become scrollable rather than shrinking
    text to unreadable sizes.

## 5. Shape, borders, and shadows

  -----------------------------------------------------------------------
  Element                             Guidance
  ----------------------------------- -----------------------------------
  Buttons                             8--12px corner radius; clear label;
                                      comfortable horizontal padding

  Inputs                              8--12px radius; 52--58px desktop
                                      height; visible focus state

  Feature cards                       10--16px radius; thin border;
                                      minimal shadow

  Large feature panels                16--24px radius; white or very pale
                                      green background

  Dashboard mockups                   12--16px radius; thin cool-gray
                                      border; soft shadow

  Pills/badges                        Fully rounded only when the compact
                                      pill shape is useful
  -----------------------------------------------------------------------

Use borders to define most cards. Shadows should be soft and restrained,
never dark or dramatic. Avoid stacking multiple shadows on one element.

## 6. Buttons, links, and forms

### Primary button

-   Background: `--color-brand-600`
-   Text: white
-   Hover: `--color-brand-700`
-   Radius: 8--12px
-   Height: about 48--52px
-   Use concise, action-specific labels: "Get started," "Get started
    free," or "Get a demo."

### Secondary button

-   White or transparent background
-   Navy text
-   Thin border: `--color-border`
-   Use when the action is less important than the primary CTA.

### Links

-   Use green for meaningful inline links.
-   Add a subtle arrow only when it helps communicate navigation.
-   Provide a clear hover and keyboard-focus state.

### Email signup

-   Input and button should align cleanly and feel like one signup unit.
-   Use helpful placeholder text such as "Enter your work email."
-   Keep reassurance such as "No credit card required" close to the form
    only if that claim is accurate.
-   Never invent security, pricing, or trial claims.

## 7. Navigation

Keep the top navigation simple and consistent across pages: - Left:
Zenpath logo. - Middle: Products, Resources, Pricing. - Right: Contact
Sales, Log in, primary "Get Started" button.

Use a white background, dark text, and a subtle bottom border or shadow
only when needed. Navigation should be around 68--80px tall on desktop.
Use consistent gaps and avoid crowding. On mobile, collapse navigation
into an accessible menu.

Do not add "Solutions" or other top-level links unless they correspond
to real, useful destinations in the product.

## 8. Homepage structure

The homepage should tell a clear story in this order.

### Section 1: Hero

**Goal:** Explain what Zenpath does and invite the right visitor to take
the next step.

-   Strong, concrete headline. Example: **"Dispatch smarter. Care
    better."**
-   Short supporting line explaining ride planning, team coordination,
    and trip tracking.
-   One primary CTA. Optionally include an email signup if it is part of
    the real onboarding flow.
-   Show a large, legible view of the actual product dashboard.
-   Keep the product image large enough to understand. Do not use a tiny
    screenshot surrounded by excessive blank space.
-   Optional pale green abstract shape behind the dashboard, with low
    contrast and restrained scale.

### Section 2: Benefit highlights

Use three compact cards: 1. **Plan every ride** --- Keep clients and
riders organized. 2. **Coordinate your team** --- Give dispatchers and
drivers a shared view. 3. **Stay on top of every trip** --- Track ride
status from pickup to destination.

Each card should have one simple line icon, a concise heading, and no
more than two short lines of body copy. Icons should use consistent
stroke weight and sit inside subtle pale-green circular backgrounds.

### Section 3: Product showcase

-   Use a pale green or very light neutral panel.
-   Put a concise headline and short explanation on the left.
-   Put a large dashboard screenshot on the right.
-   Show real product workflows such as trip status, assigned riders,
    schedules, and route visibility.
-   A map can overlap the dashboard slightly if the overlap looks
    intentional and does not obscure important UI.
-   Use a text link such as "Explore the platform" only if it leads to a
    real destination.

### Section 4: Additional capabilities or workflow

Add this section only when there are real product capabilities worth
explaining. Potential topics include scheduling, rider/client
management, team coordination, reporting, and live trip tracking. Do not
invent features. Use a second product screenshot or a simple workflow
diagram when it explains the product better than another row of cards.

### Section 5: Final call to action

-   Use one calm, pale-green panel with a clear headline.
-   Example: **"Ready to simplify dispatch?"**
-   Add one short supporting sentence and one prominent CTA.
-   Avoid repeating the entire hero or placing a giant logo beside
    another generic CTA banner.

### Footer

Include only useful, real destinations: product links, resources,
contact details, legal/privacy links, and company information. Keep the
layout tidy and visually quieter than the main page.

## 9. Product imagery and dashboard mockups

The product UI is a key trust signal. Prioritize screenshots of the real
Zenpath application.

-   Use crisp, high-resolution screenshots with readable labels.
-   Keep the dashboard's visual language consistent with the marketing
    site: white surfaces, navy text, restrained green accents, thin
    borders, and subtle shadows.
-   Make trip statuses distinct and legible.
-   Keep sample data believable and internally consistent.
-   Use a map only when it helps demonstrate route planning or trip
    tracking.
-   Avoid fake-looking tiny text, excessive floating panels, decorative
    charts with no meaning, or dashboard imagery that is too small to
    read.
-   Do not alter product functionality or claim features solely to make
    the mockup look more impressive.
-   If a screenshot is only illustrative, label it or ensure it cannot
    be mistaken for a precise representation of a capability that does
    not exist.

## 10. Iconography and decoration

-   Use one consistent line-icon family, such as Lucide.
-   Use icons sparingly to support comprehension, not as decoration on
    every line.
-   Use navy or dark green icon strokes with pale-green backgrounds.
-   Prefer simple geometric background shapes with very low contrast.
-   Avoid excessive gradients, blobs, glassmorphism, noisy textures,
    large emoji, and unrelated stock photography.

## 11. Motion and interaction

-   Motion should be subtle and purposeful: short fades, slight
    movement, and clear hover transitions.
-   Keep common transitions around 150--250ms.
-   Respect reduced-motion preferences.
-   Provide visible hover, focus, active, disabled, and loading states
    for controls.
-   Every button and link must perform its stated action. Do not create
    decorative controls that look interactive but do nothing.

## 12. Accessibility and usability

-   Use semantic headings in logical order.
-   Ensure keyboard navigation and visible focus indicators.
-   Give inputs persistent labels; placeholders are not a substitute for
    labels.
-   Add meaningful alt text to informative images and empty alt text to
    purely decorative images.
-   Maintain readable text sizes and sufficient contrast.
-   Make touch targets at least about 44px where practical.
-   Do not communicate status through color alone.
-   Ensure responsive layouts work at narrow widths and browser zoom.

## 13. Content rules

-   Write concise, direct copy that names the actual job being done.
-   Prefer benefits tied to real workflows over generic claims.
-   Keep headings short; ideally 3--8 words.
-   Keep card descriptions to one or two short sentences.
-   Use consistent terms for riders, clients, dispatchers, drivers,
    trips, and routes. Do not swap terminology randomly.
-   Do not fabricate customer logos, testimonials, statistics,
    compliance certifications, integrations, pricing, guarantees, or
    product capabilities.
-   Use real copy and real destinations wherever they are available.

## 14. AI implementation instructions

When asked to build or modify the Zenpath website:

1.  **Inspect the existing project first.** Identify the framework,
    routes, design tokens, component system, fonts, assets, and current
    responsive behavior.
2.  Reuse existing conventions and dependencies where possible. Do not
    rebuild the site from scratch if a targeted change is sufficient.
3.  Preserve working functionality, routes, forms, authentication, and
    product logic unless the task explicitly asks to change them.
4.  Define reusable CSS variables/design tokens from this file rather
    than scattering raw color values throughout components.
5.  Build reusable components for buttons, cards, navigation, feature
    sections, CTA panels, and product showcases.
6.  Match the design system across every page. Do not invent a new
    palette or visual style for each route.
7.  Use real Zenpath logo and product assets from the repository when
    available. Do not redraw or replace the logo without being asked.
8.  Use responsive layouts and verify desktop, tablet, and mobile
    breakpoints.
9.  Check for overflow, alignment problems, unreadable dashboard
    screenshots, inconsistent spacing, and low-contrast text.
10. Ensure every visible control has a working destination or action.
11. Avoid unnecessary dependencies, excessive abstraction, duplicate
    CSS, and unrelated refactors.
12. After implementation, report what changed and mention any real
    blockers or unimplemented behavior honestly.

### Suggested CSS variables

``` css
:root {
  --color-brand-500: #20C997;
  --color-brand-600: #0FA978;
  --color-brand-700: #087F5B;
  --color-brand-100: #D9F7ED;
  --color-brand-50: #F0FBF7;

  --color-ink-900: #101A33;
  --color-ink-700: #263B5A;
  --color-ink-500: #607895;
  --color-ink-400: #8DA0B6;

  --color-border: #DCE6EE;
  --color-surface: #FFFFFF;
  --color-surface-soft: #F7FAFC;
  --color-page: #FFFFFF;

  --color-success: #0F9F6E;
  --color-success-soft: #DDF7EB;
  --color-info: #2798D8;
  --color-info-soft: #E1F3FD;
  --color-warning: #D99A16;
  --color-warning-soft: #FFF3D6;
  --color-danger: #D94667;
  --color-danger-soft: #FCE7ED;

  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;

  --radius-button: 10px;
  --radius-card: 14px;
  --radius-panel: 20px;

  --container-width: 1320px;
}
```

## 15. Final design test

Before considering a page complete, ask:

-   Can a first-time visitor explain what Zenpath does within five
    seconds?
-   Is the primary CTA obvious without competing with several equally
    strong buttons?
-   Is the actual product visible and large enough to understand?
-   Are green accents purposeful rather than everywhere?
-   Do headings, cards, screenshots, and section edges align to a
    consistent grid?
-   Is the page spacious without wasting vertical space?
-   Does the page feel calm, trustworthy, modern, and appropriate for
    care-transit operations?
-   Does the mobile version feel intentionally designed rather than
    merely squeezed down?
-   Are all product claims and interactions real?

**North star:** A clean, confident, product-led SaaS website. White
space, navy typography, Zenpath green, crisp product imagery, clear
benefits, and one obvious next step.
