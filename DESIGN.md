# Jacob Brooke Site Design System

This document defines the visual design language for jacobbrooke.com. Use this as a reference when creating or modifying pages to ensure consistency while preserving each page's unique character.

---

## Design Philosophy

The site uses a **warm, earthy aesthetic** with coral accents. Pages should feel cohesive but not identical - each page can have unique elements (like the Claude Guide's model colors or Year in Review's activity colors) while sharing the same foundational design language.

**Key principles:**
- Content lives in white card containers against a cream gradient background
- Coral (#e07a5f) is the primary accent color for interactive elements and highlights
- Cards and sections use subtle gradients and shadows for depth
- Interactive elements have smooth hover transitions
- Typography is clean with clear visual hierarchy

---

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Coral** | `#e07a5f` | Primary accent - buttons, links, bullets, tags, highlights |
| **Coral Dark** | `#bc6c5c` | Gradient endpoints, hover states |
| **Coral Medium** | `#c9705e` | Section titles, author names, secondary accents |
| **Coral Hover** | `#a85a4a` | Link hover states |

### Backgrounds
| Name | Hex | Usage |
|------|-----|-------|
| **Page Cream** | `#fdf6e3` | Page background gradient start |
| **Page Tan** | `#f5e6d3` | Page background gradient end |
| **Card White** | `#ffffff` | Main card containers |
| **Card Accent Light** | `#fdf8f5` | Content card gradient start |
| **Card Accent** | `#f9ebe4` | Content card gradient end |

### Text & UI
| Name | Hex | Usage |
|------|-----|-------|
| **Text Primary** | `#333` | Main body text |
| **Text Secondary** | `#666` | Subtitles, descriptions, reviews |
| **Text Dark** | `#2d3436` | Card titles, bold content |
| **Text Muted** | `#636e72` | Dates, captions |
| **Border** | `#f0d9cc` | Card borders |
| **Border Section** | `#f5e6d3` | Section title underlines |
| **Nav Dark** | `#5c4a3d` | Navbar and footer background |

---

## Typography

### Font Stack
```css
font-family: 'Arial', sans-serif;
```

### Type Scale
| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| Page Title (h1) | 2.5em | 300 (light) | `#c9705e` | Centered, in page header |
| Section Title (h2) | 1.4em | normal | `#c9705e` | With bottom border |
| Card Title (h3) | 1.2-1.3em | 600 (semi-bold) | `#2d3436` | Job titles, achievement titles |
| Body Text | 1.1em | normal | `#666` | Bio text, descriptions |
| Small Text | 0.9-0.95em | normal | varies | Dates, reviews, captions |
| Tags/Badges | 0.9em | 500 | white | On coral background |

### Line Heights
- Body text: 1.6
- Bio/paragraph text: 1.8
- List items: 1.5
- Card descriptions: 1.6

---

## Page Structure

### Background
Every page uses the same cream gradient background:
```css
background: linear-gradient(135deg, #fdf6e3 0%, #f5e6d3 100%);
min-height: 100vh;
```

### Main Container
Content lives in a centered container:
```css
.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}
```

### Page Card
The primary content wrapper - a white card that "floats" on the gradient background:
```css
.page-card, .bio-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    overflow: hidden;
    margin-top: 50px;
}
```

---

## Components

### Page Header
Used at the top of content pages (Reads, Claude Guide, etc.):
```css
.page-header {
    text-align: center;
    margin-bottom: 40px;
}

.page-header h1 {
    font-size: 2.5em;
    color: #c9705e;
    margin-bottom: 10px;
    font-weight: 300;
}

.page-header p {
    color: #666;
    font-style: italic;
    font-size: 1.1em;
}
```

### Gradient Header (Profile/Hero)
For pages with a hero section (About page, Now page):
```css
.header, .page-header {
    background: linear-gradient(135deg, #e07a5f 0%, #bc6c5c 100%);
    color: white;
    padding: 40px 30px;
    text-align: center;
}

.page-header h1 {
    font-size: 2.5em;
    font-weight: 300;
    color: white;
    margin-bottom: 10px;
}

.page-header p {
    color: white;
    opacity: 0.9;
    font-size: 1.1em;
}

/* Links in gradient headers */
.page-header a {
    color: white;
    text-decoration: underline;
}
```

### Section Title
Used to divide content sections:
```css
.section-title {
    font-size: 1.4em;
    color: #c9705e;
    margin-bottom: 20px;
    border-bottom: 2px solid #f5e6d3;
    padding-bottom: 8px;
}
```

### Content Cards
For items like experience, achievements, books - anything that's a "card" within the page:
```css
.content-card {
    background: linear-gradient(135deg, #fdf8f5 0%, #f9ebe4 100%);
    padding: 20-25px;
    border-radius: 12px;
    margin-bottom: 20px;
    border: 1px solid #f0d9cc;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.content-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(224, 122, 95, 0.15);
}
```

**Used for:** `.experience-item`, `.achievement-card`, `.book-card`

### Accent Cards (Highlighted Items)
For emphasized content like education, featured items:
```css
.accent-card {
    background: linear-gradient(135deg, #e07a5f 0%, #bc6c5c 100%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 15px;
}
```

**Used for:** `.education-item`, featured highlights

### Tags/Skills
Pill-shaped labels:
```css
.tag, .skill {
    background: linear-gradient(135deg, #e07a5f 0%, #bc6c5c 100%);
    color: white;
    padding: 10px 18px;
    border-radius: 25px;
    font-size: 0.9em;
    font-weight: 500;
}
```

### Date Badges
For dates on cards:
```css
.date-badge {
    background: rgba(224, 122, 95, 0.1);
    color: #c9705e;
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 0.9em;
    font-weight: 500;
}
```

### Styled Lists
Lists with coral bullet points:
```css
.styled-list {
    list-style: none;
    padding: 0;
}

.styled-list li {
    padding-left: 20px;
    position: relative;
    margin-bottom: 8px;
    font-size: 0.95em;
    line-height: 1.5;
}

.styled-list li::before {
    content: '•';
    color: #e07a5f;
    font-weight: bold;
    position: absolute;
    left: 0;
}
```

### Card Grids
For responsive card layouts (books, features):
```css
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
}
```

### Links
```css
a {
    color: #c9705e;
    text-decoration: none;
    transition: color 0.2s ease;
}

a:hover {
    color: #a85a4a;
    text-decoration: underline;
}
```

---

## Navigation

Consistent across all pages:
```css
.navbar {
    background-color: #5c4a3d;
    padding: 1rem 0;
}

.nav-links a {
    color: white;
}

.nav-links a:hover,
.nav-links a.active {
    color: #e07a5f;
}
```

---

## Footer

All pages should include the "Built with Claude" footer with consistent styling and date format.

### Footer Styling
```css
.footer {
    text-align: center;
    padding: 20px;
    color: rgba(255,255,255,0.8);
    font-size: 0.9em;
}
```

### Footer Content
```html
<div class="footer">
    <p>Built with Claude 🦀 Wed 01•01•26</p>
</div>
```

### Date Format
- Format: `Day MM•DD•YY` (e.g., `Wed 01•01•26`)
- Use bullet point separator (•) between month, day, and year
- Update the date with each new push to the site
- Day abbreviation: Sun, Mon, Tue, Wed, Thu, Fri, Sat

### Footer Placement
- Place inside the main `.container` div, after the `.page-card`
- The footer text appears on the cream background (not in a dark bar)
- For pages using a dark navbar footer style, adjust color to `#555` or match page styling

---

## Page-Specific Allowances

While the core design language should be consistent, these pages have unique accent colors that complement the coral palette. **All page-specific colors should use warmer, muted tones** that harmonize with the site's earthy aesthetic.

### Claude Guide (`claude-models.html`)
- **Model colors** (warmer tones):
  - Opus: Dusty mauve `#9d7bb0` → `#7a5a8c`
  - Sonnet: Coral-orange `#d4836a` → `#c9705e`
  - Haiku: Sage green `#8fa882` → `#6d8a60`
- **Status badges**: Fresh (sage green), Current (gray), Aging (warm amber), Dated (terracotta)
- **Card structure**: Uses same content-card pattern with model-colored headers

### Year in Review (`year_in_review_2025.html`)
- **Activity colors** (warmer tones):
  - Running: Terracotta `#c4756a` → `#b5635a`
  - Walking: Dusty blue `#7a9bb5` → `#6889a3`
  - Hiking: Sage green `#8fa882` → `#6d8a60`
- **Stats cards**: Cream gradient background with activity-colored numbers
- **Section navigation**: Gradient buttons using activity colors
- **Charts**: Bar charts use terracotta gradient

### Now Page (`now.html`)
- Uses **gradient header** pattern (coral gradient with white text)
- Header subtitle includes link styling: white, underlined
- Content sections use the standard content-card styling

---

## Spacing Reference

| Element | Value |
|---------|-------|
| Container max-width | 900px |
| Container padding | 20px |
| Page card margin-top | 50px |
| Content padding | 40px 30px |
| Section margin-bottom | 35px |
| Card padding | 20-25px |
| Card margin-bottom | 20px |
| Card grid gap | 25px |
| Tag/skill gap | 12px |

---

## Shadow Reference

| Type | Value | Usage |
|------|-------|-------|
| Page card | `0 10px 30px rgba(0,0,0,0.15)` | Main content containers |
| Card hover | `0 8px 25px rgba(224, 122, 95, 0.15)` | Coral-tinted lift effect |
| Image shadow | `0 4px 12px rgba(0,0,0,0.15)` | Book covers, profile images |

---

## Interactive States

All interactive cards should have:
```css
transition: transform 0.2s ease, box-shadow 0.2s ease;

&:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(224, 122, 95, 0.15);
}
```

Links should have:
```css
transition: color 0.2s ease;
```

---

## Implementation Notes for Future Development

1. **New pages** should use the page-card container pattern
2. **New content sections** should use the content-card styling
3. **Accent colors** (beyond coral) are allowed for page-specific features but should be used sparingly
4. **Hover effects** should always include the translateY lift
5. **Section titles** always use coral with the bottom border
6. **Card grids** use auto-fit with 280px minimum for responsiveness
7. **Each page** can have embedded styles for page-specific components, but should rely on styles.css for shared patterns

---

## File Reference

| File | Purpose |
|------|---------|
| `styles.css` | Shared styles (navbar, footer, base typography) |
| `about.html` | Reference for profile/bio pages with gradient hero header |
| `reads.html` | Reference for card grid layouts |
| `now.html` | Reference for gradient header with content sections |
| `claude-models.html` | Reference for data-heavy pages with unique accent colors |
| `year_in_review_2025.html` | Reference for stats/metrics pages with activity colors |
| `DESIGN.md` | This file - design system documentation |

---

## Quick Reference: Page Patterns

| Page Type | Header Style | Content Style | Example |
|-----------|--------------|---------------|---------|
| Profile/Bio | Gradient coral hero | Experience cards, skills tags | `about.html` |
| Content List | Centered coral h1 | Card grid | `reads.html` |
| Dashboard | Centered coral h1 | Stats boxes, activity sections | `now.html` |
| Data/Tracker | Centered coral h1 | Model/activity cards with unique colors | `claude-models.html` |
| Year Review | Centered coral h1 | Stats grids, charts, highlights | `year_in_review_2025.html` |
