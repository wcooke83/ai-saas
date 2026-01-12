# SDK Settings JSON Schema

This document describes the structure of SDK settings JSON files used to save and load complete theme configurations for the AI SaaS application.

## Overview

SDK settings files contain a complete snapshot of all theme colors, UI settings, and feature toggles. These files can be loaded on the `/--sdk` page to instantly apply a complete theme.

## JSON Structure

```json
{
  "version": 1,
  "exportedAt": "2026-01-10T16:19:03.366Z",
  "colorOverrides": { ... },
  "allColors": { ... },
  "uiSettings": { ... },
  "gradientToggles": { ... }
}
```

## Root Properties

| Property | Type | Description |
|----------|------|-------------|
| `version` | number | Schema version (currently `1`) |
| `exportedAt` | string | ISO 8601 timestamp of when the file was created |
| `colorOverrides` | object | Colors that differ from defaults (for backwards compatibility) |
| `allColors` | object | **Complete snapshot of all color values** - use this when creating themes |
| `uiSettings` | object | Blur, opacity, and UI behavior settings |
| `gradientToggles` | object | Enable/disable flags for gradient features |

---

## Color Format

All colors use **RGB values as space-separated strings**:
- Format: `"R G B"` where R, G, B are 0-255
- Example: `"255 255 255"` = white
- Example: `"15 23 42"` = dark blue (secondary-900)
- Example: `"14 165 233"` = sky blue (primary-500)

These values are used with CSS `rgb()` function: `rgb(255 255 255)` or with opacity: `rgb(255 255 255 / 0.5)`

---

## allColors Structure

The `allColors` object contains two sub-objects: `light` and `dark`, each containing all CSS custom properties for that theme mode.

```json
{
  "allColors": {
    "light": {
      "--variable-name": "R G B",
      ...
    },
    "dark": {
      "--variable-name": "R G B",
      ...
    }
  }
}
```

### Page & Layout Colors

| Variable | Description | Typical Light | Typical Dark |
|----------|-------------|---------------|--------------|
| `--page-bg` | Main page background | `248 250 252` | `2 6 23` |
| `--page-gradient-from` | Page gradient start | `248 250 252` | `2 6 23` |
| `--page-gradient-to` | Page gradient end | `255 255 255` | `1 4 9` |

### Header/Toolbar Colors

| Variable | Description | Typical Light | Typical Dark |
|----------|-------------|---------------|--------------|
| `--header-bg` | Header background | `255 255 255` | `2 6 23` |
| `--header-border` | Header bottom border | `226 232 240` | `51 65 85` |
| `--header-gradient-from` | Header gradient start | `255 255 255` | `2 6 23` |
| `--header-gradient-to` | Header gradient end | `248 250 252` | `15 23 42` |

### Menu (Hamburger) Colors

| Variable | Description | Typical Light | Typical Dark |
|----------|-------------|---------------|--------------|
| `--menu-bg` | Mobile menu background | `255 255 255` | `2 6 23` |
| `--menu-border` | Menu border | `226 232 240` | `51 65 85` |
| `--menu-gradient-from` | Menu gradient start | `255 255 255` | `2 6 23` |
| `--menu-gradient-to` | Menu gradient end | `248 250 252` | `15 23 42` |

### Footer Colors

| Variable | Description | Typical Light | Typical Dark |
|----------|-------------|---------------|--------------|
| `--footer-bg` | Footer background | `248 250 252` | `2 6 23` |
| `--footer-border` | Footer top border | `226 232 240` | `51 65 85` |
| `--footer-gradient-from` | Footer gradient start | `255 255 255` | `15 23 42` |
| `--footer-gradient-to` | Footer gradient end | `241 245 249` | `2 6 23` |
| `--footer-text-heading` | Footer heading text | `15 23 42` | `241 245 249` |
| `--footer-text-primary` | Footer primary text | `100 116 139` | `148 163 184` |
| `--footer-text-secondary` | Footer secondary text | `148 163 184` | `100 116 139` |

### Text Colors

| Variable | Description | Typical Light | Typical Dark |
|----------|-------------|---------------|--------------|
| `--text-heading` | Main headings | `15 23 42` | `241 245 249` |
| `--text-primary` | Primary body text | `51 65 85` | `203 213 225` |
| `--text-secondary` | Secondary/muted text | `100 116 139` | `148 163 184` |
| `--text-caption` | Captions and helper text | `148 163 184` | `100 116 139` |

### Inner Text Colors (inside cards)

| Variable | Description | Typical Light | Typical Dark |
|----------|-------------|---------------|--------------|
| `--inner-text-heading` | Headings inside cards | `15 23 42` | `241 245 249` |
| `--inner-text-primary` | Primary text inside cards | `71 85 105` | `203 213 225` |
| `--inner-text-secondary` | Secondary text inside cards | `100 116 139` | `148 163 184` |
| `--inner-text-caption` | Captions inside cards | `148 163 184` | `100 116 139` |

### Modal Colors

| Variable | Description | Typical Light | Typical Dark |
|----------|-------------|---------------|--------------|
| `--modal-bg` | Modal background | `255 255 255` | `15 23 42` |
| `--modal-border` | Modal border | `226 232 240` | `51 65 85` |

### Primary Card Colors

| Variable | Description | Typical Light | Typical Dark |
|----------|-------------|---------------|--------------|
| `--card-bg` | Card background | `255 255 255` | `15 23 42` |
| `--card-border` | Card border | `226 232 240` | `51 65 85` |
| `--card-gradient-from` | Card gradient start | `255 255 255` | `15 23 42` |
| `--card-gradient-to` | Card gradient end | `248 250 252` | `30 41 59` |

### Secondary Card Colors (feature cards)

| Variable | Description |
|----------|-------------|
| `--secondary-card-bg` | Background |
| `--secondary-card-bg-gradient-from` | Gradient start |
| `--secondary-card-bg-gradient-to` | Gradient end |
| `--secondary-card-border` | Border |
| `--secondary-card-heading` | Heading text |
| `--secondary-card-text-primary` | Primary text |
| `--secondary-card-text-secondary` | Secondary text |
| `--secondary-card-hover-bg` | Hover background |
| `--secondary-card-hover-bg-gradient-from` | Hover gradient start |
| `--secondary-card-hover-bg-gradient-to` | Hover gradient end |
| `--secondary-card-hover-border` | Hover border |

### Specialty Card Colors (CTA cards)

| Variable | Description |
|----------|-------------|
| `--specialty-card-bg` | Background (typically vibrant color) |
| `--specialty-card-bg-gradient-from` | Gradient start |
| `--specialty-card-bg-gradient-to` | Gradient end |
| `--specialty-card-border` | Border |
| `--specialty-card-heading` | Heading text (typically white) |
| `--specialty-card-text-primary` | Primary text |
| `--specialty-card-text-secondary` | Secondary text |
| `--specialty-card-hover-bg` | Hover background |
| `--specialty-card-hover-bg-gradient-from` | Hover gradient start |
| `--specialty-card-hover-bg-gradient-to` | Hover gradient end |
| `--specialty-card-hover-border` | Hover border |

### Specialty Card Buttons

| Variable | Description |
|----------|-------------|
| `--specialty-card-primary-btn-bg` | Primary button background |
| `--specialty-card-primary-btn-border` | Primary button border |
| `--specialty-card-primary-btn-text` | Primary button text |
| `--specialty-card-primary-btn-hover-bg` | Primary button hover background |
| `--specialty-card-primary-btn-hover-border` | Primary button hover border |
| `--specialty-card-primary-btn-hover-text` | Primary button hover text |
| `--specialty-card-secondary-btn-bg` | Secondary button background |
| `--specialty-card-secondary-btn-border` | Secondary button border |
| `--specialty-card-secondary-btn-text` | Secondary button text |
| `--specialty-card-secondary-btn-hover-bg` | Secondary button hover background |
| `--specialty-card-secondary-btn-hover-border` | Secondary button hover border |
| `--specialty-card-secondary-btn-hover-text` | Secondary button hover text |

### Inner Card Colors (nested cards)

| Variable | Description |
|----------|-------------|
| `--inner-card-bg` | Background |
| `--inner-card-bg-gradient-from` | Gradient start |
| `--inner-card-bg-gradient-to` | Gradient end |
| `--inner-card-border` | Border |
| `--inner-card-text-primary` | Primary text |
| `--inner-card-text-secondary` | Secondary text |
| `--inner-card-hover-bg` | Hover background |
| `--inner-card-hover-bg-gradient-from` | Hover gradient start |
| `--inner-card-hover-bg-gradient-to` | Hover gradient end |
| `--inner-card-hover-border` | Hover border |

### Inner Card Buttons

Similar structure to specialty card buttons with `--inner-card-primary-btn-*` and `--inner-card-secondary-btn-*` prefixes.

### Code Card Colors

| Variable | Description | Typical Light | Typical Dark |
|----------|-------------|---------------|--------------|
| `--code-card-bg` | Code block background | `15 23 42` | `2 6 23` |
| `--code-card-bg-gradient-from` | Gradient start | `15 23 42` | `2 6 23` |
| `--code-card-bg-gradient-to` | Gradient end | `30 41 59` | `15 23 42` |
| `--code-card-border` | Border | `51 65 85` | `30 41 59` |
| `--code-card-text` | Code text | `241 245 249` | `226 232 240` |

### Status Card Colors

#### Info Card (`--info-card-*`)

| Variable | Light Default | Dark Default |
|----------|---------------|--------------|
| `--info-card-bg` | `238 242 255` | `49 46 129` |
| `--info-card-bg-gradient-from` | `238 242 255` | `49 46 129` |
| `--info-card-bg-gradient-to` | `224 231 255` | `55 48 163` |
| `--info-card-border` | `165 180 252` | `99 102 241` |
| `--info-card-heading` | `55 48 163` | `199 210 254` |
| `--info-card-text-primary` | `67 56 202` | `165 180 252` |
| `--info-card-text-secondary` | `79 70 229` | `129 140 248` |

#### Error Card (`--error-card-*`)

| Variable | Light Default | Dark Default |
|----------|---------------|--------------|
| `--error-card-bg` | `254 242 242` | `127 29 29` |
| `--error-card-bg-gradient-from` | `254 242 242` | `127 29 29` |
| `--error-card-bg-gradient-to` | `254 226 226` | `153 27 27` |
| `--error-card-border` | `252 165 165` | `239 68 68` |
| `--error-card-heading` | `153 27 27` | `254 202 202` |
| `--error-card-text-primary` | `185 28 28` | `252 165 165` |
| `--error-card-text-secondary` | `220 38 38` | `248 113 113` |

#### Success Card (`--success-card-*`)

| Variable | Light Default | Dark Default |
|----------|---------------|--------------|
| `--success-card-bg` | `240 253 244` | `20 83 45` |
| `--success-card-bg-gradient-from` | `240 253 244` | `20 83 45` |
| `--success-card-bg-gradient-to` | `220 252 231` | `22 101 52` |
| `--success-card-border` | `134 239 172` | `34 197 94` |
| `--success-card-heading` | `22 101 52` | `187 247 208` |
| `--success-card-text-primary` | `21 128 61` | `134 239 172` |
| `--success-card-text-secondary` | `22 163 74` | `74 222 128` |

#### Warning Card (`--warning-card-*`)

| Variable | Light Default | Dark Default |
|----------|---------------|--------------|
| `--warning-card-bg` | `254 252 232` | `113 63 18` |
| `--warning-card-bg-gradient-from` | `254 252 232` | `113 63 18` |
| `--warning-card-bg-gradient-to` | `254 249 195` | `133 77 14` |
| `--warning-card-border` | `253 224 71` | `234 179 8` |
| `--warning-card-heading` | `133 77 14` | `254 240 138` |
| `--warning-card-text-primary` | `161 98 7` | `253 224 71` |
| `--warning-card-text-secondary` | `202 138 4` | `250 204 21` |

### Inner Status Cards

Same variables as status cards above, with `--inner-` prefix.

#### Inner Info Card (`--inner-info-card-*`)

| Variable | Light Default | Dark Default |
|----------|---------------|--------------|
| `--inner-info-card-bg` | `238 242 255` | `49 46 129` |
| `--inner-info-card-bg-gradient-from` | `238 242 255` | `49 46 129` |
| `--inner-info-card-bg-gradient-to` | `224 231 255` | `55 48 163` |
| `--inner-info-card-border` | `165 180 252` | `99 102 241` |
| `--inner-info-card-heading` | `55 48 163` | `199 210 254` |
| `--inner-info-card-text-primary` | `67 56 202` | `165 180 252` |
| `--inner-info-card-text-secondary` | `79 70 229` | `129 140 248` |

#### Inner Error Card (`--inner-error-card-*`)

| Variable | Light Default | Dark Default |
|----------|---------------|--------------|
| `--inner-error-card-bg` | `254 242 242` | `127 29 29` |
| `--inner-error-card-bg-gradient-from` | `254 242 242` | `127 29 29` |
| `--inner-error-card-bg-gradient-to` | `254 226 226` | `153 27 27` |
| `--inner-error-card-border` | `252 165 165` | `239 68 68` |
| `--inner-error-card-heading` | `153 27 27` | `254 202 202` |
| `--inner-error-card-text-primary` | `185 28 28` | `252 165 165` |
| `--inner-error-card-text-secondary` | `220 38 38` | `248 113 113` |

#### Inner Success Card (`--inner-success-card-*`)

| Variable | Light Default | Dark Default |
|----------|---------------|--------------|
| `--inner-success-card-bg` | `240 253 244` | `20 83 45` |
| `--inner-success-card-bg-gradient-from` | `240 253 244` | `20 83 45` |
| `--inner-success-card-bg-gradient-to` | `220 252 231` | `22 101 52` |
| `--inner-success-card-border` | `134 239 172` | `34 197 94` |
| `--inner-success-card-heading` | `22 101 52` | `187 247 208` |
| `--inner-success-card-text-primary` | `21 128 61` | `134 239 172` |
| `--inner-success-card-text-secondary` | `22 163 74` | `74 222 128` |

#### Inner Warning Card (`--inner-warning-card-*`)

| Variable | Light Default | Dark Default |
|----------|---------------|--------------|
| `--inner-warning-card-bg` | `254 252 232` | `113 63 18` |
| `--inner-warning-card-bg-gradient-from` | `254 252 232` | `113 63 18` |
| `--inner-warning-card-bg-gradient-to` | `254 249 195` | `133 77 14` |
| `--inner-warning-card-border` | `253 224 71` | `234 179 8` |
| `--inner-warning-card-heading` | `133 77 14` | `254 240 138` |
| `--inner-warning-card-text-primary` | `161 98 7` | `253 224 71` |
| `--inner-warning-card-text-secondary` | `202 138 4` | `250 204 21` |

### Form Colors

| Variable | Description | Light Default | Dark Default |
|----------|-------------|---------------|--------------|
| `--form-element-bg` | Form input/textarea background | `255 255 255` | `12 19 37` |

### Button Colors

| Variable | Description | Light Default | Dark Default |
|----------|-------------|---------------|--------------|
| `--primary-button-bg` | Primary button background | `99 102 241` | `99 102 241` |
| `--primary-button-hover-bg` | Primary button hover | `79 70 229` | `79 70 229` |
| `--secondary-button-bg` | Secondary button background | `255 255 255` | `15 23 42` |
| `--secondary-button-hover-bg` | Secondary button hover | `248 250 252` | `30 41 59` |

### Theme Toggle Colors (Light/Dark/System Switcher)

| Variable | Description | Light Default | Dark Default |
|----------|-------------|---------------|--------------|
| `--theme-toggle-bg` | Container background | `241 245 249` | `30 41 59` |
| `--theme-toggle-border` | Container border | `226 232 240` | `51 65 85` |
| `--theme-toggle-button-bg` | Active button background | `255 255 255` | `51 65 85` |
| `--theme-toggle-button-hover-bg` | Hover background | `226 232 240` | `51 65 85` |
| `--theme-toggle-icon` | Icon color (inactive) | `100 116 139` | `148 163 184` |
| `--theme-toggle-icon-active` | Active icon color | `15 23 42` | `241 245 249` |

### Primary Color Scale (Brand/Accent Colors)

The primary color scale defines the main brand/accent colors used throughout the application. These are typically vibrant, eye-catching colors.

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `--primary-50` | Lightest tint | `240 249 255` |
| `--primary-100` | Very light | `224 242 254` |
| `--primary-200` | Light | `186 230 253` |
| `--primary-300` | Light-medium | `125 211 252` |
| `--primary-400` | Medium-light | `56 189 248` |
| `--primary-500` | Base color | `14 165 233` |
| `--primary-600` | Medium-dark | `2 132 199` |
| `--primary-700` | Dark | `3 105 161` |
| `--primary-800` | Very dark | `7 89 133` |
| `--primary-900` | Darkest | `12 74 110` |
| `--primary-950` | Near black | `8 47 73` |

### Secondary Color Scale (Neutral/Gray Colors)

The secondary color scale defines the neutral/gray colors used for backgrounds, borders, text, and UI chrome. These provide the foundation for the theme.

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `--secondary-50` | Lightest (near white) | `248 250 252` |
| `--secondary-100` | Very light | `241 245 249` |
| `--secondary-200` | Light | `226 232 240` |
| `--secondary-300` | Light-medium | `203 213 225` |
| `--secondary-400` | Medium-light | `148 163 184` |
| `--secondary-500` | Medium | `100 116 139` |
| `--secondary-600` | Medium-dark | `71 85 105` |
| `--secondary-700` | Dark | `51 65 85` |
| `--secondary-800` | Very dark | `30 41 59` |
| `--secondary-825` | Between 800/900 (form elements) | `12 19 37` |
| `--secondary-900` | Darkest | `15 23 42` |
| `--secondary-950` | Near black | `2 6 23` |

### Tooltip Colors

| Variable | Description | Light Default | Dark Default |
|----------|-------------|---------------|--------------|
| `--tooltip-bg` | Tooltip background | `15 23 42` | `241 245 249` |
| `--tooltip-text` | Tooltip text | `248 250 252` | `15 23 42` |
| `--tooltip-border` | Tooltip border | `51 65 85` | `203 213 225` |
| `--tooltip-min-width` | Minimum width (CSS size) | `8rem` | `8rem` |
| `--tooltip-max-width` | Maximum width (CSS size) | `42rem` | `42rem` |

### Toast Colors

#### Success Toast (`--toast-success-*`)

| Variable | Light Default | Dark Default |
|----------|---------------|--------------|
| `--toast-success-bg` | `240 253 244` | `20 83 45` |
| `--toast-success-text` | `22 101 52` | `187 247 208` |
| `--toast-success-border` | `134 239 172` | `34 197 94` |

#### Error Toast (`--toast-error-*`)

| Variable | Light Default | Dark Default |
|----------|---------------|--------------|
| `--toast-error-bg` | `254 242 242` | `127 29 29` |
| `--toast-error-text` | `153 27 27` | `254 202 202` |
| `--toast-error-border` | `252 165 165` | `239 68 68` |

#### Warning Toast (`--toast-warning-*`)

| Variable | Light Default | Dark Default |
|----------|---------------|--------------|
| `--toast-warning-bg` | `254 252 232` | `113 63 18` |
| `--toast-warning-text` | `133 77 14` | `254 240 138` |
| `--toast-warning-border` | `253 224 71` | `234 179 8` |

#### Info Toast (`--toast-info-*`)

| Variable | Light Default | Dark Default |
|----------|---------------|--------------|
| `--toast-info-bg` | `238 242 255` | `49 46 129` |
| `--toast-info-text` | `55 48 163` | `199 210 254` |
| `--toast-info-border` | `165 180 252` | `99 102 241` |

### Accordion Colors (Collapsible Sections)

| Variable | Description | Light Default | Dark Default |
|----------|-------------|---------------|--------------|
| `--accordion-border` | Accordion border | `226 232 240` | `51 65 85` |
| `--accordion-header-bg` | Header background | `248 250 252` | `30 41 59` |
| `--accordion-header-hover-bg` | Header hover background | `241 245 249` | `51 65 85` |
| `--accordion-title` | Title text color | `51 65 85` | `203 213 225` |
| `--accordion-icon` | Chevron icon color | `100 116 139` | `148 163 184` |
| `--accordion-content-bg` | Content area background | `255 255 255` | `15 23 42` |

### Subsection Colors (Non-Collapsible Sections)

| Variable | Description | Light Default | Dark Default |
|----------|-------------|---------------|--------------|
| `--subsection-icon` | Section icon color | `15 23 42` | `241 245 249` |
| `--subsection-title` | Section title text | `2 6 23` | `248 250 252` |

---

## uiSettings Structure

```json
{
  "uiSettings": {
    "backdropBlur": "md",
    "headerBlurEnabled": true,
    "headerBlurUseColor": true,
    "headerBlurOpacity": 85,
    "menuBlurEnabled": true,
    "menuBlurIntensity": "md",
    "menuBlurUseColor": true,
    "menuBlurOpacity": 85
  }
}
```

| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `backdropBlur` | string | `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` | Header blur intensity |
| `headerBlurEnabled` | boolean | `true`/`false` | Enable blur effect on header |
| `headerBlurUseColor` | boolean | `true`/`false` | Show background color behind blur |
| `headerBlurOpacity` | number | 0-100 | Opacity of header background |
| `menuBlurEnabled` | boolean | `true`/`false` | Enable blur on mobile menu |
| `menuBlurIntensity` | string | `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` | Menu blur intensity |
| `menuBlurUseColor` | boolean | `true`/`false` | Show background color behind menu blur |
| `menuBlurOpacity` | number | 0-100 | Opacity of menu background |

### Blur Intensity Values

| Value | CSS | Pixels |
|-------|-----|--------|
| `none` | `backdrop-blur-none` | 0px |
| `sm` | `backdrop-blur-sm` | 4px |
| `md` | `backdrop-blur-md` | 12px |
| `lg` | `backdrop-blur-lg` | 16px |
| `xl` | `backdrop-blur-xl` | 24px |
| `2xl` | `backdrop-blur-2xl` | 40px |
| `3xl` | `backdrop-blur-3xl` | 64px |

---

## gradientToggles Structure

```json
{
  "gradientToggles": {
    "pageGradient": false,
    "cardGradient": true,
    "cardBorder": true,
    "modalBorder": true,
    "headerGradient": false,
    "menuGradient": false,
    "footerGradient": false
  }
}
```

| Property | Type | Description |
|----------|------|-------------|
| `pageGradient` | boolean | Use gradient for page background |
| `cardGradient` | boolean | Use gradient for card backgrounds |
| `cardBorder` | boolean | Show borders on cards |
| `modalBorder` | boolean | Show borders on modals |
| `headerGradient` | boolean | Use gradient for header background |
| `menuGradient` | boolean | Use gradient for mobile menu background |
| `footerGradient` | boolean | Use gradient for footer background |

---

## Creating a New Theme

When creating a new theme JSON file:

1. Start with the complete structure including `version: 1`
2. Populate `allColors` with both `light` and `dark` objects
3. Include ALL color variables for consistency
4. Set `uiSettings` for blur preferences
5. Set `gradientToggles` for gradient preferences

### Example: Dark Blue Theme

```json
{
  "version": 1,
  "exportedAt": "2026-01-10T12:00:00.000Z",
  "colorOverrides": { "light": {}, "dark": {} },
  "allColors": {
    "light": {
      "--page-bg": "241 245 249",
      "--header-bg": "255 255 255",
      "--header-border": "226 232 240",
      "--card-bg": "255 255 255",
      "--card-border": "226 232 240",
      "--text-heading": "15 23 42",
      "--text-primary": "51 65 85",
      "--theme-toggle-bg": "241 245 249",
      "--theme-toggle-border": "226 232 240",
      "--theme-toggle-button-bg": "255 255 255",
      "--theme-toggle-button-hover-bg": "226 232 240",
      "--theme-toggle-icon": "100 116 139",
      "--theme-toggle-icon-active": "15 23 42",
      "--primary-50": "240 249 255",
      "--primary-500": "14 165 233",
      "--primary-600": "2 132 199",
      "--secondary-50": "248 250 252",
      "--secondary-100": "241 245 249",
      "--secondary-900": "15 23 42",
      "--accordion-border": "226 232 240",
      "--accordion-header-bg": "248 250 252",
      "--accordion-title": "51 65 85",
      "--subsection-icon": "15 23 42",
      "--subsection-title": "2 6 23"
    },
    "dark": {
      "--page-bg": "15 23 42",
      "--header-bg": "30 41 59",
      "--header-border": "51 65 85",
      "--card-bg": "30 41 59",
      "--card-border": "51 65 85",
      "--text-heading": "241 245 249",
      "--text-primary": "203 213 225",
      "--theme-toggle-bg": "30 41 59",
      "--theme-toggle-border": "51 65 85",
      "--theme-toggle-button-bg": "51 65 85",
      "--theme-toggle-button-hover-bg": "51 65 85",
      "--theme-toggle-icon": "148 163 184",
      "--theme-toggle-icon-active": "241 245 249",
      "--primary-50": "240 249 255",
      "--primary-500": "14 165 233",
      "--primary-600": "2 132 199",
      "--secondary-50": "248 250 252",
      "--secondary-100": "241 245 249",
      "--secondary-900": "15 23 42",
      "--accordion-border": "51 65 85",
      "--accordion-header-bg": "30 41 59",
      "--accordion-title": "203 213 225",
      "--subsection-icon": "241 245 249",
      "--subsection-title": "248 250 252"
    }
  },
  "uiSettings": {
    "backdropBlur": "lg",
    "headerBlurEnabled": true,
    "headerBlurUseColor": true,
    "headerBlurOpacity": 80,
    "menuBlurEnabled": true,
    "menuBlurIntensity": "lg",
    "menuBlurUseColor": true,
    "menuBlurOpacity": 80
  },
  "gradientToggles": {
    "pageGradient": true,
    "cardGradient": true,
    "cardBorder": true,
    "modalBorder": true,
    "headerGradient": false,
    "menuGradient": false,
    "footerGradient": false
  }
}
```

---

## Color Palette Reference

### Secondary (Gray) Scale

| Name | RGB Value | Hex |
|------|-----------|-----|
| secondary-50 | `248 250 252` | #f8fafc |
| secondary-100 | `241 245 249` | #f1f5f9 |
| secondary-200 | `226 232 240` | #e2e8f0 |
| secondary-300 | `203 213 225` | #cbd5e1 |
| secondary-400 | `148 163 184` | #94a3b8 |
| secondary-500 | `100 116 139` | #64748b |
| secondary-600 | `71 85 105` | #475569 |
| secondary-700 | `51 65 85` | #334155 |
| secondary-800 | `30 41 59` | #1e293b |
| secondary-900 | `15 23 42` | #0f172a |
| secondary-950 | `2 6 23` | #020617 |

### Primary (Sky Blue) Scale

| Name | RGB Value | Hex |
|------|-----------|-----|
| primary-50 | `240 249 255` | #f0f9ff |
| primary-100 | `224 242 254` | #e0f2fe |
| primary-200 | `186 230 253` | #bae6fd |
| primary-300 | `125 211 252` | #7dd3fc |
| primary-400 | `56 189 248` | #38bdf8 |
| primary-500 | `14 165 233` | #0ea5e9 |
| primary-600 | `2 132 199` | #0284c7 |
| primary-700 | `3 105 161` | #0369a1 |
| primary-800 | `7 89 133` | #075985 |
| primary-900 | `12 74 110` | #0c4a6e |

### Accent Colors (Indigo)

| Name | RGB Value | Hex |
|------|-----------|-----|
| indigo-500 | `99 102 241` | #6366f1 |
| indigo-600 | `79 70 229` | #4f46e5 |
| indigo-700 | `67 56 202` | #4338ca |
| indigo-800 | `55 48 163` | #3730a3 |
| indigo-900 | `49 46 129` | #312e81 |

---

## Tips for AI Agents

1. **Always include both light and dark modes** - Users expect themes to work in both modes
2. **Maintain contrast ratios** - Text should be readable against backgrounds (WCAG AA: 4.5:1 for normal text)
3. **Use consistent color relationships** - Borders should be lighter/darker than backgrounds
4. **Test hover states** - Hover colors should be noticeably different from default states
5. **Consider gradients** - When `gradientToggles` are enabled, gradient colors will be used instead of solid colors
6. **Blur settings affect transparency** - Lower opacity values (30-50) show more blur effect, higher values (70-90) show more color
7. **Use the Primary Color Scale for branding** - When creating a themed look, update `--primary-50` through `--primary-950` with your brand colors. These affect buttons, links, and accent elements
8. **Use the Secondary Color Scale for neutrals** - Update `--secondary-50` through `--secondary-950` to change the gray/neutral palette. These affect backgrounds, borders, and text colors throughout the app
9. **Theme Toggle must match the theme** - Update `--theme-toggle-*` variables to ensure the light/dark/system mode switcher fits your color scheme
10. **Color scales should maintain progression** - Keep 50 as lightest, 950 as darkest. Ensure smooth visual progression between shades for professional results
11. **Accordions and Subsections should match the overall theme** - Update `--accordion-*` and `--subsection-*` variables to match your color palette. These control the collapsible section headers and non-collapsible subsection titles seen in settings panels
